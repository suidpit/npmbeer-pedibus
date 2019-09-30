package it.polito.ai.pedibus.api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.polito.ai.pedibus.api.dtos.LocalizationMessageDTO;
import it.polito.ai.pedibus.api.dtos.LocalizationSTOMPMessage;
import it.polito.ai.pedibus.api.exceptions.DeniedOperationException;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.services.ReservationService;
import it.polito.ai.pedibus.api.services.ShiftService;
import it.polito.ai.pedibus.api.services.UserService;
import it.polito.ai.pedibus.configuration.WebSocketConfig;
import it.polito.ai.pedibus.security.CustomUserDetails;
import org.apache.tomcat.jni.Local;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.time.LocalDate;

@Controller
public class LocalizationController implements ApplicationListener<ApplicationEvent> {

    private Logger logger = LoggerFactory.getLogger(LocalizationController.class);


    @Autowired
    private WebSocketConfig socketConfig;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ShiftService shiftService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/localize/{shiftId}")
    public void publishCurrentLocation(@DestinationVariable String shiftId,
                                       LocalizationMessageDTO localizationMessageDTO,
                                       StompHeaderAccessor accessor,
                                       Authentication authentication){
        // TODO: check authority

        // TODO save latest update
        CustomUserDetails user = (CustomUserDetails)authentication.getPrincipal();

        // Allow only the companion assigned to the current shift to post the relative position.
        try{
            if(this.shiftService.getCompanionIdByShiftId(new ObjectId(shiftId)).equals(user.getId())){
                LocalizationSTOMPMessage message = new LocalizationSTOMPMessage();
                message.setContent(objectMapper.writeValueAsString(localizationMessageDTO));
                messagingTemplate.convertAndSend("/topic/localize/"+shiftId, message);
            }
            else{
                throw new DeniedOperationException();
            }
        }
        catch(Exception e){
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
            String sessionId = accessor.getSessionId();
            headerAccessor.setMessage("Unauthorized sending of data on /app/localize/" + shiftId);
            headerAccessor.setSessionId(sessionId);
            socketConfig.clientOutboundChannel.send(MessageBuilder.createMessage(new byte[0], headerAccessor.getMessageHeaders()));
        }
    }

    @Override
    public void onApplicationEvent(ApplicationEvent e) {

        /**
        * Checks if the subscriber to a given run localization is actually authorized too its updates, i.e.
        * if the parent has got any reservation on such line-direction-trip-index-date for any of its kids.
        * */
        if (e instanceof SessionSubscribeEvent) {
            SessionSubscribeEvent sse = (SessionSubscribeEvent) e;
            Message<byte[]> message = sse.getMessage();
            StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
            StompCommand command = accessor.getCommand();

            if (command != null && command.equals(StompCommand.SUBSCRIBE)) {
                String sessionId = accessor.getSessionId();
                String destination = accessor.getDestination();

                String regex = "/topic/localize/.*";
                if (false){ //destination != null && destination.matches(regex)) {
                    try {
                        String[] fields = destination.split("/");
                        String shiftId = fields[3];

                        // If provided shift id in destination isn't existing or isn't a proper shift == Unauthorized
                        Shift shift = shiftService.getShiftById(new ObjectId(shiftId)); // may throw exception -> caught.
                        if (shift == null) {
                            throw new DeniedOperationException();
                        }

                        ObjectId userId;
                        // No principal registered == Unauthorized
                        // (shouldn't happen anyway since it should be blocked at connection time)
                        if (sse.getUser() instanceof CustomUserDetails) {
                            userId = ((CustomUserDetails) sse.getUser()).getId();
                        } else {
                            throw new DeniedOperationException();
                        }

                        String lineName = shift.getLineName();
                        LocalDate date = shift.getDate();
                        Integer tripIndex = shift.getTripIndex();
                        Reservation.Direction direction = shift.getDirection();

                        Reservation res = reservationService.getReservationByAllParams(userId, lineName, tripIndex, direction, date);
                        // No matching reservation == unauthorized to see location updates.
                        if (res == null) {
                            throw new DeniedOperationException();
                        }

                        // this should be useless.
                        /*
                        if(res.getDirection() != shift.getDirection() ||
                                !res.getTripIndex().equals(shift.getTripIndex()) ||
                                !res.getLineName().equals(shift.getLineName()) ||
                                !res.getDate().equals(shift.getDate())){
                            throw new DeniedOperationException();
                        }*/

                        // all checks have passed, can subscribe => do nothing
                        // TODO: send latest update. -> need to change model to store it in db
                    } catch (Exception ex) {

                        // Close connection.
                        StompHeaderAccessor headerAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
                        headerAccessor.setMessage("Unauthorized subscription to destination " + destination);
                        headerAccessor.setSessionId(sessionId);
                        socketConfig.clientOutboundChannel.send(MessageBuilder.createMessage(new byte[0], headerAccessor.getMessageHeaders()));
                    }
                }
            }
        }
    }
}
