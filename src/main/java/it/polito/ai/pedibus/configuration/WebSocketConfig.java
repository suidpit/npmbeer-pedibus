package it.polito.ai.pedibus.configuration;

import it.polito.ai.pedibus.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import javax.naming.AuthenticationException;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    @Qualifier("clientOutboundChannel")
    public MessageChannel clientOutboundChannel;

    @Autowired
    @Lazy
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/localization-endpoint")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {

            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                String sessionId = accessor.getSessionId();

                if (true){ //StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authToken = accessor.getFirstNativeHeader("Authentication");
                    String jwt = jwtTokenProvider.getTokenFromStringHeader(authToken);
                    try{
                        if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                            Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
                            accessor.setUser(authentication);
                        }
                        else{
                            throw new AuthenticationException("Invalid or null JWT");
                        }
                    }
                    catch (AuthenticationException error){
                        StompHeaderAccessor headerAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
                        headerAccessor.setMessage(error.getMessage());
                        headerAccessor.setSessionId(sessionId);
                        clientOutboundChannel.send(MessageBuilder.createMessage(new byte[0], headerAccessor.getMessageHeaders()));
                        return null;
                    }
                }
                return message;
            }
        });
    }
}
