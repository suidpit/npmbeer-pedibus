package it.polito.ai.pedibus.api.events;

import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.UUID;

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

        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        service.createRecoveryToken(user, token);
        String recipientAddress = user.getEmail();


        String subject = "Recovery Password";
        String confirmationUrl
                = event.getAppUrl() + "/recover/" + token;
        String message = "RECOVER PASSWORD!!";
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + " " + "http://192.168.99.100:8080" + confirmationUrl);
        mailSender.send(email);
    }
}
