package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.EmailDTO;
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

@RestController
public class RecoveryPwdController {
    private Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    @Autowired
    EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired
    ApplicationEventPublisher eventPublisher;
    @Autowired
    IUserService service;
    @RequestMapping(value = "/recover", method = RequestMethod.POST)
    public String recoverPasswordSendEmail(
            @RequestBody @Valid EmailDTO emailDTO,
            BindingResult result,
            WebRequest request,
            Errors errors) {
        logger.info("Recovery ENDPOINT Received "+ emailDTO.toString());
        logger.info("Email:  "+emailDTO.getEmail());
        if (result.hasErrors()) {
            return result.getFieldErrors().toString();
        }
        User registered = service.getUserByEmail(emailDTO.getEmail());
        if (registered == null) {
            result.rejectValue("email", "message.regError");
        }
        if(!registered.isEnabled()){
            return "error: user not enabled";
        }
        EmailVerificationToken emailVerificationToken = service.getVerificationTokenByUser(registered);
        logger.info("USER: " + registered.toString());
        logger.info("GET TOKEN:  "+emailVerificationTokenRepository.getByUser(registered).toString());

        logger.info("FIND TOKEN:  "+emailVerificationTokenRepository.findByUser(registered).toString());

        logger.info("TOKEN:  "+ emailVerificationToken.toString());

        try {
            String appUrl = request.getContextPath();
            eventPublisher.publishEvent(new OnRecoveryCompleteEvent
                    (registered, request.getLocale(), appUrl));

        } catch (Exception me) {
            return "error "+ me.toString();
        }

        return "fine recover";

    }

    /*GET /recover/{randomUUID} – Restituisce una pagina HTML contente una form per la
    sostituzione della password*/
    @RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.GET)
    public String recoverPwdForm
    (WebRequest request, Model model, @PathVariable("randomUUID") String token){
        return "recoverPwdForm";
    }

    @RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.POST)
    public String recoverPwd
            (WebRequest request, Model model, @PathVariable("randomUUID") String token){
        return "recoverPwdForm";
    }

}

