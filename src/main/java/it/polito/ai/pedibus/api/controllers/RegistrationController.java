package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.validation.Valid;
import java.util.Calendar;
import java.util.Locale;

@RestController
public class RegistrationController {

    private Logger logger = LoggerFactory.getLogger(RegistrationController.class);


    /*POST /register – invia un oggetto JSON contenente e-mail, password, password di verifica.
    Controlla che l’utente con l’indirizzo di posta indicato non sia già presente nella base dati
    degli utenti, controlla che le due password combacino e siano sufficientemente sicure, crea
    un record con i dati dell’utente e ne fissa lo stato alla condizione di attesa di verifica. Invia
    all’indirizzo di posta un link random per l’abilitazione dell’account.*/

    @Autowired
    ApplicationEventPublisher eventPublisher;

    @Autowired
    IUserService service;

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String registerUserAccount(
            @RequestBody @Valid UserDTO accountDto,
            BindingResult result,
            WebRequest request,
            Errors errors) throws EmailExistsException {

        if (result.hasErrors()) {
            return "error in bindingRes: " + result.getFieldErrors().toString();

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



    @RequestMapping(value = "/confirm/{randomUUID}", method = RequestMethod.GET)
    public String confirmRegistration
            (WebRequest request, Model model, @PathVariable("randomUUID") String token)
            throws EmailTokenNotFoundException
    {

        Locale locale = request.getLocale();

        logger.info("In /regitrationConfirm");
        EmailVerificationToken verificationToken = service.getVerificationToken(token);
        if (verificationToken == null) {
            /*String message = messages.getMessage("auth.message.invalidToken", null, locale);
            model.addAttribute("message", message);*/
            //return "redirect:/badUser.html?lang=" + locale.getLanguage();
            throw new EmailTokenNotFoundException();
        }

        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            // return 404 not found
            //return "redirect:/badUser.html?lang=" + locale.getLanguage();
            throw new EmailTokenNotFoundException();
        }


        service.enableUser(user);
        return "redirect:/login.html?lang=" + request.getLocale().getLanguage();
    }
}
