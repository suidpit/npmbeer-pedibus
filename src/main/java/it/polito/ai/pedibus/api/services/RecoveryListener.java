package it.polito.ai.pedibus.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class RecoveryListener implements ApplicationListener<OnRecoveryCompleteEvent> {
    @Override
    public void onApplicationEvent(OnRecoveryCompleteEvent event) {
        this.sendEmailRecovery(event);
    }

    @Autowired
    private IUserService service;
    @Autowired
    private JavaMailSender mailSender;

    private void sendEmailRecovery(OnRecoveryCompleteEvent event) {
        EmailVerificationToken emailVerificationToken = event.getToken();
        //Random UUID già assegnato in fase di registrazione
        String token =  emailVerificationToken.getToken();

        String recipientAddress = emailVerificationToken.getUser().getEmail();
        String subject = "Recovery Password";
        String confirmationUrl
                = event.getAppUrl() + "/recover/" + token;
        String message = "RECOVER PASSWORD!!";
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + " " + "http://localhost:8080" + confirmationUrl);
        mailSender.send(email);
    }
}
