package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.UserPrivilegesDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserAdministrationController {

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SYSTEM_ADMIN')")
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String getUsers(Model m){
        List<User> users = userRepository.findAll();
        m.addAttribute("users_list", users.stream().map(User::getEmail).collect(Collectors.toList()));
        return "user_list";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_SYSTEM_ADMIN')")
    @RequestMapping(value = "/{userId}", method = RequestMethod.PUT)
    public String putUser(@RequestAttribute("userId")String userId,
                          @RequestBody UserPrivilegesDTO privilegesDTO,
                          Model m){
        // TODO implement return ?
       User user = null;
       if(userRepository.findById(userId).isPresent()){
            user = userRepository.findById(userId).get();
            user.setRoles(privilegesDTO.getRoles());
            user.setAuthorities(privilegesDTO.getAuthorities());
            userRepository.save(user);
       }

        return null;
    }
}
