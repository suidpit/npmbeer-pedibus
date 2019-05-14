package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.api.services.EmailNotificationService;
import it.polito.ai.pedibus.api.services.OnRegistrationCompleteEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.mail.MailException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.validation.Valid;

@RestController
//@RequestMapping("/mio")
public class RegLoginController {

    private Logger logger = LoggerFactory.getLogger(RegLoginController.class);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailNotificationService emailNotificationService;

    @RequestMapping(value = "/prova", method = RequestMethod.GET)
    public String prova(){
        return  "prova";
    }

    /*POST /register – invia un oggetto JSON contenente e-mail, password, password di verifica.
    Controlla che l’utente con l’indirizzo di posta indicato non sia già presente nella base dati
    degli utenti, controlla che le due password combacino e siano sufficientemente sicure, crea
    un record con i dati dell’utente e ne fissa lo stato alla condizione di attesa di verifica. Invia
    all’indirizzo di posta un link random per l’abilitazione dell’account.*/
    //@Transactional
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String register(@RequestBody @Valid UserDTO userDTO, BindingResult bindingResult) {
        User user = User.builder()
                .email(userDTO.getEmail())
                .password(userDTO.getPass())
                .enabled(false)
                .build();

       if (bindingResult.hasErrors()){
            return bindingResult.getFieldErrors().toString();
       }

       else if (!userRepository.existsByEmail(user.getEmail())) {
            userRepository.insert(user);
            try {
                emailNotificationService.sendEmail(user);
            } catch (MailException e) {
                logger.info("Email sending error " + e.getMessage());
            }
       }
       return "success";
    }
    @Autowired
    ApplicationEventPublisher eventPublisher;

    @RequestMapping(value = "/user/registration", method = RequestMethod.POST)
    public String registerUserAccount(
            @RequestBody @Valid UserDTO accountDto,
            BindingResult result,
            WebRequest request,
            Errors errors) {

        if (result.hasErrors()) {
            return result.getFieldErrors().toString();
        }

        User registered = User.builder()
                .email(accountDto.getEmail())
                .password(accountDto.getPass())
                .enabled(false)
                .build();
        if (registered == null) {
            result.rejectValue("email", "message.regError");
        }
        try {
            String appUrl = request.getContextPath();
            eventPublisher.publishEvent(new OnRegistrationCompleteEvent
                    (registered, request.getLocale(), appUrl));
        } catch (Exception me) {
            return "error";
        }
        return "success";
    }
}
