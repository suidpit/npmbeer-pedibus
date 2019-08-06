package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/shifts")
public class ShiftController {

    private final ShiftRepository shiftRepository;
    private final DateTimeFormatter fmt;
    
    @Autowired
    public ShiftController(ShiftRepository shiftRepository, DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.fmt = fmt;
    }

    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public List<Shift> getShifts(@PathVariable("lineName") String lineName,
                                 @PathVariable("date") String dateString){
        List<String> authorities = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getAuthorities()
            .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        if(!authorities.contains("SYSTEM_ADMIN")){
            // TODO remove list of availabilities from response.
        }
        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = shiftRepository.findByLineNameAndDate(lineName, date);
        return shifts;
    }

    /*@RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.POST)
    public String postShift(@RequestBody shiftRequestDTO shiftRequestDTO){
        //TODO IMPLEMENT
        return null;
    }
    */

}
