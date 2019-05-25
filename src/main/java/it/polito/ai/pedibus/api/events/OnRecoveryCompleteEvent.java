package it.polito.ai.pedibus.api.events;

import it.polito.ai.pedibus.api.models.User;
import lombok.Data;
import org.springframework.context.ApplicationEvent;

import java.util.Locale;

@Data
public class OnRecoveryCompleteEvent extends ApplicationEvent {
    private String appUrl;
    private Locale locale;
    private User user;
    public OnRecoveryCompleteEvent(User user, Locale locale, String appUrl) {
        super(user);
        this.user = user;
        this.locale = locale;
        this.appUrl = appUrl;
    }
}
