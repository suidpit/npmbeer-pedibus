package it.polito.ai.pedibus.api.events;

import it.polito.ai.pedibus.api.events.OnRegistrationCompleteEvent;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
public class RegistrationListener implements
        ApplicationListener<OnRegistrationCompleteEvent> {

    @Autowired
    private IUserService service;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        this.confirmRegistration(event);
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        service.createVerificationToken(user, token);

        String recipientAddress = user.getEmail();
        String username = user.getEmail().split("@")[0];
        String subject = "Verifica Indirizzo Email";
        String confirmationUrl
                = event.getAppUrl() + "/" + token;
       // String message = messages.getMessage("message.regSucc", null, event.getLocale());

        String message = "Ciao "+username+",\n\ngrazie per aver creato un account sulla nostra app Pedibus, " +
                "benvenuto!\n" +
                "Ti richiediamo soltanto un ultimo semplice passaggio per verificare che questo indirizzo email sia " +
                "valido e per impostare la tua password, puoi farlo cliccando sul seguente link: \n\n";
        String message_part2 = "\n\n(se il link non funziona copialo e incollalo nella barra degli indirizzi del tuo " +
                "browser)"+
                "\n\nUna volta fatto, sarai pronto per iniziare a usare Pedibus!\n\n" +
                "Un saluto,\nIl Team di NapalmBeer";
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom("no-reply@napalm.beer");
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + " " + "http://192.168.99.100:9000/impostaPassword" + confirmationUrl + message_part2);
        mailSender.send(email);
    }
}