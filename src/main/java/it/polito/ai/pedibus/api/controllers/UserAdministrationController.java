package it.polito.ai.pedibus.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserAdministrationController {

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('SYSTEM-ADMIN')")
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String getUsers(Model m){
        List<User> users = userRepository.findAll();
        m.addAttribute("users_list", users);
        return "user_list";
    }
}
