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


}
