package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.NewEventDTO;
import it.polito.ai.pedibus.api.dtos.ShiftRequestDTO;
import it.polito.ai.pedibus.api.dtos.ShiftResponseDTO;
import it.polito.ai.pedibus.api.exceptions.*;
import it.polito.ai.pedibus.api.models.*;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;
import it.polito.ai.pedibus.api.services.*;
import it.polito.ai.pedibus.security.CustomUserDetails;
import it.polito.ai.pedibus.security.LineGrantedAuthority;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import reactor.core.publisher.Mono;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/admin/shifts")
public class ShiftController {

    private final ShiftRepository shiftRepository;
    private final LineService lineService;
    private final ShiftService shiftService;
    private final UserService userService;
    private final EventService eventService;

    private ReservationService reservationService;
    @Qualifier("fmt")
    private final DateTimeFormatter fmt;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    public ShiftController(ShiftRepository shiftRepository, LineService lineService,
                           ShiftService shiftService, UserService userService,
                           EventService eventService, ReservationService reservationService,
                           DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.lineService = lineService;
        this.shiftService = shiftService;
        this.userService = userService;
        this.eventService = eventService;
        this.reservationService = reservationService;
        this.fmt = fmt;
    }



    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsAfterDate(@PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = this.shiftService.getAllShiftAfterDate(date);

        return purgeShifts(shifts);
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/by-date/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsOnDate(@PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        List<Shift> shifts = this.shiftService.getShiftsByDateAndCompanionId(date, userId);

        return purgeShifts(shifts);
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/assigned/{date}/{id}", method = RequestMethod.GET)
    public List<Shift> getShiftsByIdAndAfterDate(@PathVariable("date") String dateString,
                                                 @PathVariable("id") String idString){

        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        ObjectId userId = usr.getId();
        ObjectId id = new ObjectId(idString);

        if(!userId.equals(id)){
            throw new DeniedOperationException();
        }

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = this.shiftService.getAllShiftsAfterDateByCompanionId(date, userId);

        return purgeShifts(shifts);
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsByLineAndDate(@PathVariable("lineName") String lineName,
                                 @PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = shiftRepository.findByDateGreaterThanEqualAndLineName(lineName, date);

        return purgeShifts(shifts);
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/availability", method = RequestMethod.POST)
    public ArrayList<String> postAvailability(@RequestBody ShiftRequestDTO[] shiftRequestDTOs){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        ObjectId userId = usr.getId();
        ArrayList<String> ids = new ArrayList<>();

        for(ShiftRequestDTO sDTO: shiftRequestDTOs){
            Shift s;
            // Shift was in db already
            if(sDTO.getShiftId() != null){
                s = this.shiftService.getShiftById(sDTO.getShiftId());
                List<ObjectId> availabilities = s.getAvailabilities();
                if(!availabilities.contains(userId)){
                    availabilities.add(userId);
                }
                s.setAvailabilities(availabilities);
            }
            // Shift to be added in db yet
            else{
                s = new Shift();
                Line l = this.lineService.getLine(sDTO.getLineName());

                if(l == null){
                    throw new LineNotExistingException();
                }

                s.setLineName(sDTO.getLineName());
                s.setDate(sDTO.getDate());
                s.setDefaultCompanion(l.getAdmin_email());
                s.setCompanionId(null);
                s.setOpen(true);
                s.setDirection(sDTO.getDirection());
                s.setTripIndex(sDTO.getTripIndex());

                // setting starting and ending stops and times
                Stop from = l.getStops().get(l.getStops().size()-1);
                Stop to = l.getStops().get(0);
                if(s.getDirection() == Reservation.Direction.BACK){
                    s.setFrom(from.getName());
                    s.setStartsAt(from.getBack().get(s.getTripIndex()));
                    // Take last stop
                    s.setTo(to.getName());
                    s.setEndsAt(to.getBack().get(s.getTripIndex()));
                }
                else{
                    Stop temp = from;
                    from = to;
                    to = temp;
                    s.setFrom(from.getName());
                    s.setStartsAt(from.getOutward().get(s.getTripIndex()));
                    // Take last stop
                    s.setTo(to.getName());
                    s.setEndsAt(to.getOutward().get(s.getTripIndex()));
                }

                s.setLastUpdate(from.getPosition());
                ArrayList<ObjectId> availabilities = new ArrayList<>();
                availabilities.add(userId);

                s.setAvailabilities(availabilities);
            }
            ObjectId id = this.shiftService.insertOrUpdateShift(s).getId();

            ids.add(id.toString());
        }
        return ids;
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/cancel_availability", method = RequestMethod.POST)
    public void cancelAvailability(@RequestBody ShiftRequestDTO shiftRequestDTO){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        ObjectId userId = usr.getId();
        Shift s;
        // Shift was in db already
        if(shiftRequestDTO.getShiftId() != null){
            s = this.shiftService.getShiftById(shiftRequestDTO.getShiftId());
            if(s != null){
                if(s.getCompanionId() != null && s.getCompanionId().equals(userId)){
                    // cannot cancel availability if you were assigned to shift
                    throw new DeniedOperationException();
                }
                List<ObjectId> availabilities = s.getAvailabilities();
                availabilities.remove(userId);
                s.setAvailabilities(availabilities);
                this.shiftService.insertOrUpdateShift(s);
            }
        }
        else{
            throw new WrongFormatException();
        }
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @Transactional
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/confirm", headers = "Accept=application/json", method = RequestMethod.POST)
    public Mono<Event> postShiftConfirmation(@RequestBody @Valid ShiftRequestDTO shiftRequestDTO){
        // TODO send notification to user.
        if(canView(shiftRequestDTO.getLineName())){
            if(shiftRequestDTO.getShiftId() != null || shiftRequestDTO.getAssignedCompanionEmail().equals(lineService.getLine(shiftRequestDTO.getLineName()).getAdmin_email())){
                Shift s;
                if(shiftRequestDTO.getShiftId()==null){
                    s = new Shift();
                    Line l = this.lineService.getLine(shiftRequestDTO.getLineName());

                    if(l == null){
                        throw new LineNotExistingException();
                    }

                    s.setLineName(shiftRequestDTO.getLineName());
                    s.setDate(shiftRequestDTO.getDate());
                    s.setDefaultCompanion(l.getAdmin_email());
                    s.setOpen(true);
                    s.setDirection(shiftRequestDTO.getDirection());
                    s.setTripIndex(shiftRequestDTO.getTripIndex());

                    // setting starting and ending stops and times
                    Stop from = l.getStops().get(l.getStops().size()-1);
                    Stop to = l.getStops().get(0);
                    if(s.getDirection() == Reservation.Direction.BACK){
                        s.setFrom(from.getName());
                        s.setStartsAt(from.getBack().get(s.getTripIndex()));
                        // Take last stop
                        s.setTo(to.getName());
                        s.setEndsAt(to.getBack().get(s.getTripIndex()));
                    }
                    else{
                        Stop temp = from;
                        from = to;
                        to = temp;
                        s.setFrom(from.getName());
                        s.setStartsAt(from.getOutward().get(s.getTripIndex()));
                        // Take last stop
                        s.setTo(to.getName());
                        s.setEndsAt(to.getOutward().get(s.getTripIndex()));
                    }

                    s.setLastUpdate(from.getPosition());
                }else{
                    s = this.shiftService.getShiftById(shiftRequestDTO.getShiftId());
                }
                User u = this.userService.getUserByEmail(shiftRequestDTO.getAssignedCompanionEmail());
                if(u != null){
                    s.setCompanionId(u.getId());
                    s.setOpen(true);
                    if(shiftRequestDTO.getTo() == null || s.getTo().equals(shiftRequestDTO.getTo())){
                        this.shiftService.insertOrUpdateShift(s);
                        String eventBody = new StringBuilder("Sei stato assegnato al turno del ")
                                .append(s.getDate().toString())
                                .append(" delle ore ")
                                .append(s.getStartsAt().toString())
                                .append(" sulla linea ")
                                .append(s.getLineName())
                                .append(" in direzione ")
                                .append(s.getDirection())
                                .append(" in partenza dalla fermata: ")
                                .append(s.getFrom())
                                .toString();
                        NewEventDTO event = NewEventDTO.builder()
                                .type("Shift")
                                .body(eventBody)
                                .userId(s.getCompanionId())
                                .objectReferenceId(s.getId())
                                .build();

                        return this.eventService.pushNewEvent(event);
                    }
                    else{
                        if(shiftRequestDTO.getEndsAt()==null || shiftRequestDTO.getPosition()==null)
                            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
                        // create complementary shift.
                        try{
                            Shift complementary_shift = (Shift) s.clone();
                            complementary_shift.setId(null);
                            complementary_shift.setCompanionId(null);
                            complementary_shift.setFrom(shiftRequestDTO.getTo());
                            complementary_shift.setLastUpdate(shiftRequestDTO.getPosition());
                            complementary_shift.setStartsAt(shiftRequestDTO.getEndsAt());
                            s.setTo(shiftRequestDTO.getTo());
                            s.setEndsAt(shiftRequestDTO.getEndsAt());
                            this.shiftService.insertOrUpdateShift(s);
                            this.shiftService.insertOrUpdateShift(complementary_shift);
                            String eventBody = new StringBuilder("Sei stato assegnato al turno del ")
                                    .append(s.getDate().toString())
                                    .append(" delle ore ")
                                    .append(s.getStartsAt().toString())
                                    .append(" sulla linea ")
                                    .append(s.getLineName())
                                    .append(" in direzione ")
                                    .append(s.getDirection())
                                    .append(" in partenza dalla fermata: ")
                                    .append(s.getFrom())
                                    .toString();
                            NewEventDTO event = NewEventDTO.builder()
                                    .type("Shift")
                                    .body(eventBody)
                                    .userId(s.getCompanionId())
                                    .objectReferenceId(s.getId())
                                    .build();

                            return this.eventService.pushNewEvent(event);
                        }
                        catch(Exception e){
                            // TODO create complementary shift anew (if here is because of clone failure so -> no clone).
                        }
                    }
                }
                else{
                    throw new NoSuchUserException();
                }
            }
            else{
                throw new WrongFormatException();
            }
        }
        else{
            throw new UnauthorizedLineActionException();
        }
        return Mono.empty();
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/toggle-open", headers = "Accept=application/json", method = RequestMethod.POST)
    public void postOpenCloseShift(@RequestBody ShiftRequestDTO[] shiftRequestDTOs){
        for(ShiftRequestDTO sDTO: shiftRequestDTOs){
            try {
                Shift s = this.shiftService.getShiftById(sDTO.getShiftId());
                if(this.canView(s.getLineName())){
                    if(s.getCompanionId()!=null){
                        s.setOpen(sDTO.isOpen());
                        // TODO improve by using saveAll => one db query only.
                        this.shiftService.insertOrUpdateShift(s);
                    }
                    else{
                        throw new DeniedOperationException();
                    }
                }
                else {
                    throw new UnauthorizedLineActionException();
                }
            }
            catch(NullPointerException e){
                throw new WrongFormatException();
            }
        }
    }

    @RequestMapping(value = "by-resid/{resid}", method = RequestMethod.GET)
    public ArrayList<ShiftResponseDTO> getShiftIdByReservationId(@PathVariable("resid") String resid){
        Reservation res = reservationService.getReservation(new ObjectId(resid));

        if(res == null) return null;

        // reject request if user is not reservation owner.
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        if(!res.getUser().equals(userId)){
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }
        List<Shift> shifts = shiftService.getShiftsByAllFields(res.getDate(), res.getLineName(), res.getDirection(), res.getTripIndex());

        ArrayList<ShiftResponseDTO> return_array = new ArrayList<>();
        if(shifts != null){
            for(Shift s: shifts){
                ShiftResponseDTO dto = new ShiftResponseDTO();
                dto.setDate(s.getDate());
                dto.setLineName(s.getLineName());
                dto.setDirection(s.getDirection());
                dto.setShiftId(s.getId());
                dto.setFrom(s.getFrom());
                dto.setTo(s.getTo());
                dto.setLatestUpdate(s.getLastUpdate());
                dto.setStartsAt(s.getStartsAt());
                dto.setEndsAt(s.getEndsAt());
                return_array.add(dto);
            }
            return return_array;
        }
        return null;
    }

    /**
     * "Cleans" a list of shifts from the availabilities if the current Principal is not
     * authoritative on the corresponfing line.
     * @param shifts: List of shifts to clean.
     * @return: purged list of shifts;
     */

    private List<Shift> purgeShifts(List<Shift> shifts){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());
        /*
         * For each shift retrieved, hide the availabilities$ of utils companions (privacy)
         * but, if present, keep the user's availability (can be used in front end).
         * Only the system admin / admin for that line can view the availabilities$.
         * */
        for(Shift s: shifts){
            if(!canView(s.getLineName())){
                if(s.getAvailabilities().contains(usr.getId())){
                    ArrayList<ObjectId> availabilities = new ArrayList<>();
                    availabilities.add(usr.getId());
                    s.setAvailabilities(availabilities);
                }
                else
                    s.setAvailabilities(null);
            }
        }
        return shifts;
    }

    /**
     * Returns whether the current Principal is authoritative on the given line.
     * @param lineName: name of the line the principal needs to be check against
     * @return: boolean is authoritative or not
     */
    private boolean canView(String lineName){
        boolean canView = false;
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        for(GrantedAuthority a: usr.getAuthorities()){
            if(a instanceof LineGrantedAuthority){
                if(a.getAuthority().equals("ADMIN") && ((LineGrantedAuthority) a).getLineNames().contains(lineName)){
                    canView = true;
                    break;
                }
            }
            else{
                if(a.getAuthority().equals("SYSTEM_ADMIN")){
                    canView = true;
                    break;
                }
            }
        }
        return canView;
    }
}
