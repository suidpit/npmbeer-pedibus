package it.polito.ai.pedibus.controllers;

import it.polito.ai.pedibus.api.controllers.RegistrationController;
import it.polito.ai.pedibus.api.dtos.NewPasswordDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.services.IUserService;
import it.polito.ai.pedibus.api.services.RecoveryToken;
import it.polito.ai.pedibus.api.services.RecoveryTokenNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Calendar;

@Controller
public class RecoveryPasswordController {
    private Logger logger = LoggerFactory.getLogger(RegistrationController.class);
    @Autowired
    IUserService service;

    /*GET /recover/{randomUUID} – Restituisce una pagina HTML contente una form per la
  sostituzione della password*/
    @RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.GET)
    public String recoverPwdForm (Model model, @PathVariable("randomUUID") String token)throws RecoveryTokenNotFoundException{
       // model.addAttribute("register",new NewPasswordDTO());
        RecoveryToken recoveryToken = service.getRecoveryToken(token);
        Calendar cal = Calendar.getInstance();
        if ((recoveryToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            throw new RecoveryTokenNotFoundException();
        }
        return "recoverPwdForm";
    }

    /*    POST /recover/{radomUUID} – Verifica che il codice random corrisponda ad uno di quelli
        che sono stati generati da una richiesta di recovery e che tale codice non sia scaduto.
        Verifica inoltre che le due password inviate corrispondano e che abbiano i necessari criteri
        di robustezza. In caso positivo aggiorna la base dati degli utenti con la nuova password e
        restituisce 200 – Ok, in caso negativo restituisce 404 – Not found*/
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
        return "recoverPwdForm";
    }
}
