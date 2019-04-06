package it.polito.ai.pedibus.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {

    @RequestMapping(value="/", method = RequestMethod.GET)
    String getHome() {
        return "home";
    }

}
