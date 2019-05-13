package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {
    private JavaMailSender javaMailSender;

    @Autowired
    public EmailNotificationService(JavaMailSender javaMailSender){
        this.javaMailSender=javaMailSender;
    }


    public void sendEmail(User user) throws MailException {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setFrom("NapalmAndBeer@gmail.com");
        mail.setSubject("NapalmBeer verify");
        mail.setText("Welcome to NapalmBeer Team!");
        javaMailSender.send(mail);
    }
}
