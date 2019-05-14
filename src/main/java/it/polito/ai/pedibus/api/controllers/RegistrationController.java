package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.api.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.mail.MailException;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.validation.Valid;
import java.util.Calendar;
import java.util.Locale;

@RestController
//@RequestMapping("/mio")
public class RegistrationController {

    private Logger logger = LoggerFactory.getLogger(RegistrationController.class);
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

    @Autowired
    IUserService service;
    @RequestMapping(value = "/user/registration", method = RequestMethod.POST)
    public String registerUserAccount(
            @RequestBody @Valid UserDTO accountDto,
            BindingResult result,
            WebRequest request,
            Errors errors) throws EmailExistsException {

        if (result.hasErrors()) {
            return result.getFieldErrors().toString();
        }

        User registered = service.registerNewUserAccount(accountDto);
        if (registered == null) {
            result.rejectValue("email", "message.regError");
        }
        try {
            String appUrl = request.getContextPath();

            eventPublisher.publishEvent(new OnRegistrationCompleteEvent
                    (registered, request.getLocale(), appUrl));

        } catch (Exception me) {
            return "error "+ me.toString();
        }
        return "success";
    }



    @RequestMapping(value = "/regitrationConfirm.html", method = RequestMethod.GET)
    public String confirmRegistration
            (WebRequest request, Model model, @RequestParam("token") String token) {

        Locale locale = request.getLocale();

        logger.info("In /regitrationConfirm");
        ModelEmailVerificationToken verificationToken = service.getVerificationToken(token);
        if (verificationToken == null) {
            /*String message = messages.getMessage("auth.message.invalidToken", null, locale);
            model.addAttribute("message", message);*/
            return "redirect:/badUser.html?lang=" + locale.getLanguage();
        }

        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            /*String messageValue = messages.getMessage("auth.message.expired", null, locale)
            model.addAttribute("message", messageValue);*/
            return "redirect:/badUser.html?lang=" + locale.getLanguage();
        }

        user.setEnabled(true);
        service.saveRegisteredUser(user);
        return "redirect:/login.html?lang=" + request.getLocale().getLanguage();
    }
}
