package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.EmailDTO;
import it.polito.ai.pedibus.api.dtos.NewPasswordDTO;
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

@RestController
public class RecoveryPwdController {
    private Logger logger = LoggerFactory.getLogger(UserAuthController.class);

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
        logger.info("USER: " + registered.toString());

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


/*    POST /recover/{radomUUID} – Verifica che il codice random corrisponda ad uno di quelli
    che sono stati generati da una richiesta di recovery e che tale codice non sia scaduto.
    Verifica inoltre che le due password inviate corrispondano e che abbiano i necessari criteri
    di robustezza. In caso positivo aggiorna la base dati degli utenti con la nuova password e
    restituisce 200 – Ok, in caso negativo restituisce 404 – Not found*/
    @RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.POST)
    public String recoverPwd
            (@RequestBody @Valid NewPasswordDTO newPasswordDTO,
             BindingResult result,
             WebRequest request,
             @PathVariable("randomUUID") String token) throws RecoveryTokenNotFoundException{


        if (result.hasErrors()) {
            return "error in bindingRes: " + result.getFieldErrors().toString();
        }
        logger.info("PASS: Checkink recoveryToken" + newPasswordDTO.toString());
        RecoveryToken recoveryToken = service.getRecoveryToken(token);
        logger.info("RECOVERY TOKEN: " + recoveryToken.toString());

        if(recoveryToken==null){
            result.rejectValue("email", "message.regError");
        }
        Calendar cal = Calendar.getInstance();
        logger.info("tokenTime " + recoveryToken.getExpiryDate().getTime()+ "---" + "Curr time: " + cal.getTime().getTime());
        logger.info("Difference time: " + (recoveryToken.getExpiryDate().getTime() - cal.getTime().getTime()) );
        if ((recoveryToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            throw new RecoveryTokenNotFoundException();
        }
        if(newPasswordDTO.getPass().equals(newPasswordDTO.getRepass())){
            User user = recoveryToken.getUser();
            service.userChangePassword(user,newPasswordDTO.getPass());
            service.expireRecoveryToken(recoveryToken);
        }else {
            logger.info("Password Diverse");
            throw new RecoveryTokenNotFoundException();
        }
        return "recoverPwdForm";
    }

}

