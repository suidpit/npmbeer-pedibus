package it.polito.ai.pedibus.api.controllers;



import it.polito.ai.pedibus.api.dtos.LoginDTO;
import it.polito.ai.pedibus.api.dtos.NewPasswordDTO;
import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.validation.Valid;
import java.util.Calendar;
import java.util.Locale;

@RestController
public class UserAuthController {

    private Logger logger = LoggerFactory.getLogger(UserAuthController.class);

    /*POST /register – invia un oggetto JSON contenente e-mail, password, password di verifica.
    Controlla che l’utente con l’indirizzo di posta indicato non sia già presente nella base dati
    degli utenti, controlla che le due password combacino e siano sufficientemente sicure, crea
    un record con i dati dell’utente e ne fissa lo stato alla condizione di attesa di verifica. Invia
    all’indirizzo di posta un link random per l’abilitazione dell’account.*/

    @Autowired
    ApplicationEventPublisher eventPublisher;

    @Autowired
    IUserService service;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(
        @RequestBody LoginDTO loginDTO
    ){
        logger.info(loginDTO.getEmail());
        logger.info(loginDTO.getPassword());
        return service.signin(loginDTO.getEmail(), loginDTO.getPassword());
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String registerUserAccount(
            @RequestBody @Valid UserDTO accountDto,
            BindingResult result,
            WebRequest request,
            Errors errors) throws EmailExistsException {

        if (result.hasErrors()) {
            StringBuilder sb = new StringBuilder("Failure - Reason:\n");
            for(FieldError fe: result.getFieldErrors()){
                sb.append("Field: ").append(fe.getField());
                sb.append(" - Error: ").append(fe.getDefaultMessage()).append("\n");
            }
            return sb.toString();
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
        return "";
    }


    @ResponseStatus(HttpStatus.OK)
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
            throw new EmailTokenNotFoundException();
        }

        service.enableUser(user);
        service.expireRegistationToken(verificationToken);
        return "";
    }
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.POST)
    public String recoverPassword
            (@Valid @ModelAttribute("changePassword") NewPasswordDTO newPasswordDTO,
             BindingResult result,
             WebRequest request,
             Model model,
             @PathVariable("randomUUID") String token) throws RecoveryTokenNotFoundException {


        if (result.hasErrors()) {
            return "error in bindingRes: " + result.getFieldErrors().toString();
        }
        model.addAttribute("changePassword",newPasswordDTO);
        logger.info("PASS: Checkink recoveryToken " + newPasswordDTO.toString());
        RecoveryToken recoveryToken = service.getRecoveryToken(token);
        logger.info("RECOVERY TOKEN: " + recoveryToken.toString());

        if(recoveryToken==null){
            result.rejectValue("email", "message.regError");
            throw new RecoveryTokenNotFoundException();
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
            logger.info("Passwords are different");
            throw new RecoveryTokenNotFoundException();
        }
        return "success:Cambio pwd";
    }

}
