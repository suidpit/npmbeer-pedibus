package it.polito.ai.pedibus.controllers;

import it.polito.ai.pedibus.api.dtos.NewPasswordDTO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;

@Controller
public class RecoveryPasswordController {

    /*GET /recover/{randomUUID} – Restituisce una pagina HTML contente una form per la
  sostituzione della password*/
    @RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.GET)
    public String recoverPwdForm (Model model, @PathVariable("randomUUID") String token){
        model.addAttribute("register",new NewPasswordDTO());
        return "recoverPwdForm";
    }

    /*@RequestMapping(value = "/recover/{randomUUID}", method = RequestMethod.POST)
    public String processingrecoverPwdForm (
            @Valid @ModelAttribute("registration") NewPasswordDTO newPasswordDTO,
            BindingResult bindingResult,
            RedirectAttributes ra,
            Model model,
            @PathVariable("randomUUID") String token)
    {
       return "recoverPwdForm";
    }*/

}
