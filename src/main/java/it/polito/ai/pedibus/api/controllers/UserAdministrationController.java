package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.dtos.EmailDTO;
import it.polito.ai.pedibus.api.dtos.UserPrivilegesDTO;
import it.polito.ai.pedibus.api.events.OnRegistrationCompleteEvent;
import it.polito.ai.pedibus.api.exceptions.EmailExistsException;
import it.polito.ai.pedibus.api.models.SystemAuthority;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import it.polito.ai.pedibus.security.CustomUserDetailsService.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;

import javax.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserAdministrationController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    ApplicationEventPublisher eventPublisher;
    @Autowired
    IUserService service;


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<String> getUsers(Model m) {
        List<User> users = userRepository.findAll();
        m.addAttribute("users_list", users.stream().map(User::getEmail).collect(Collectors.toList()));
        return users.stream().map(User::getEmail).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @RequestMapping(value = "/{userId}", method = RequestMethod.PUT)
    public String putUser(@PathVariable("userId")String userId,
                          @RequestBody @Valid UserPrivilegesDTO privilegesDTO){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String line = privilegesDTO.getLineName();
        boolean canPut = false;

        if(hasAuthority(userDetails.getAuthorities(), "SYSTEM_ADMIN")) {
            canPut = true;
        }
        else{
            for(GrantedAuthority a: userDetails.getAuthorities()){
                if(a instanceof LineGrantedAuthority){
                    if(((LineGrantedAuthority) a).getLineNames().contains(line)){
                        canPut = true;
                        break;
                    }
                }
            }
        }

        if(canPut){
            User user;
            if (userRepository.findById(userId).isPresent()) {
                user = userRepository.findById(userId).get();
                if(line.equals("")){
                    if(privilegesDTO.getAction().toLowerCase().equals("add")) {
                        user.getRoles().add(privilegesDTO.getAuthority().name());
                    }
                    else if(privilegesDTO.getAction().toLowerCase().equals("remove")){
                        user.getRoles().remove(privilegesDTO.getAuthority().name());
                    }
                }
                else{
                    SystemAuthority sa = user.getAuthorities().stream()
                            .filter(systemAuthority ->
                                    systemAuthority.getAuthority().equals(privilegesDTO.getAuthority()))
                            .findFirst().orElse(null);
                    if(privilegesDTO.getAction().toLowerCase().equals("add")) {
                        if(sa == null){
                            sa = new SystemAuthority();
                            sa.setAuthority(privilegesDTO.getAuthority());
                            ArrayList<String> lines = new ArrayList<>();
                            lines.add(line);
                            sa.setLine_names(lines);
                            user.getAuthorities().add(sa);
                        }
                        else{
                            sa.getLine_names().add(line);
                        }
                    }
                    else if(privilegesDTO.getAction().toLowerCase().equals("remove")){
                        if(sa == null){
                            // do nothing
                        }
                        else{
                            sa.getLine_names().remove(line);
                        }
                    }
                }
                userRepository.save(user);
            }
        }
        else{
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        return "success";
    }

    private boolean hasAuthority(Collection<? extends GrantedAuthority> authorities, String authority){
        boolean hasAuthority = false;
        for (GrantedAuthority grantedAuthority : authorities) {
            hasAuthority = grantedAuthority.getAuthority().equals(authority);
            if (hasAuthority) break;
        }
        return hasAuthority;
    }

    /*Admin adds an e-mail for the new user*/
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @RequestMapping(value = "/addNewUser", method = RequestMethod.POST)
    public String addNewUser(@RequestBody @Valid EmailDTO emailDTO,
                             BindingResult result,
                             WebRequest request,
                             Errors errors)throws EmailExistsException {
        if (result.hasErrors()) {
            StringBuilder sb = new StringBuilder("Failure - Reason:\n");
            for(FieldError fe: result.getFieldErrors()){
                sb.append("Field: ").append(fe.getField());
                sb.append(" - Error: ").append(fe.getDefaultMessage()).append("\n");
            }
            return sb.toString();
        }
        User res = service.getUserByEmail(emailDTO.getEmail());
        //email già inserita
        if (res != null) {
            result.rejectValue("email", "message.regError");
            throw  new EmailExistsException();
        }
        try {

            User registered = service.registerNewUserEmail(emailDTO);
            String appUrl = request.getContextPath();

            eventPublisher.publishEvent(new OnRegistrationCompleteEvent
                    (registered, request.getLocale(), appUrl));

        } catch (Exception me) {
            return "error "+ me.toString();
        }
        return "";

    }

}
