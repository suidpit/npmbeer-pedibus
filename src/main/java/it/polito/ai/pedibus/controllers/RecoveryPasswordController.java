package it.polito.ai.pedibus.controllers;

import it.polito.ai.pedibus.api.controllers.UserAuthController;
import it.polito.ai.pedibus.api.exceptions.RecoveryTokenNotFoundException;
import it.polito.ai.pedibus.api.models.RecoveryToken;
import it.polito.ai.pedibus.api.services.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Calendar;

@Controller
public class RecoveryPasswordController {
    private Logger logger = LoggerFactory.getLogger(UserAuthController.class);

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


}
