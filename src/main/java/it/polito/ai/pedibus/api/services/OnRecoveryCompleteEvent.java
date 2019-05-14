package it.polito.ai.pedibus.api.services;

import lombok.Data;
import org.springframework.context.ApplicationEvent;

import java.util.Locale;

@Data
public class OnRecoveryCompleteEvent extends ApplicationEvent {
    private String appUrl;
    private Locale locale;
    private EmailVerificationToken token;
    public OnRecoveryCompleteEvent(EmailVerificationToken token, Locale locale, String appUrl) {
        super(token);
        this.token = token;
        this.locale = locale;
        this.appUrl = appUrl;
    }
}
