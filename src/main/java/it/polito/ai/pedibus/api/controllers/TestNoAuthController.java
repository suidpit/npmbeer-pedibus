package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.EmailDTO;
import it.polito.ai.pedibus.api.exceptions.EmailExistsException;
import it.polito.ai.pedibus.api.exceptions.EmailNotExistsException;
import it.polito.ai.pedibus.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;


@RestController
public class TestNoAuthController {

    @Autowired
    IUserService service;

    @RequestMapping(value = "/profile",method = RequestMethod.GET)
    public List<HashMap<String, String>> getChildrenByEmail(@RequestBody EmailDTO emailDTO) throws EmailNotExistsException {

        String email = emailDTO.getEmail();
        return service.getChildren(email);
    }

    @RequestMapping(value = "/ciao",method = RequestMethod.GET)
    public String getCiao(){
        return "CIAO";
    }
}
