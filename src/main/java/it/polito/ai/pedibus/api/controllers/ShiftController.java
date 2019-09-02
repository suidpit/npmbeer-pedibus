package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.ShiftRequestDTO;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;
import it.polito.ai.pedibus.security.CustomUserDetails;
import it.polito.ai.pedibus.security.LineGrantedAuthority;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/admin/shifts")
public class ShiftController {

    private final ShiftRepository shiftRepository;

    @Qualifier("fmt")
    private final DateTimeFormatter fmt;
    
    @Autowired
    public ShiftController(ShiftRepository shiftRepository, DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.fmt = fmt;
    }


    // TODO add "COMPANION" role

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public List<Shift> getShifts(@PathVariable("lineName") String lineName,
                                 @PathVariable("date") String dateString){
        boolean canView = false;
        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = shiftRepository.findByLineNameAndDate(lineName, date);

        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        for(GrantedAuthority a: usr.getAuthorities()){
            if(a instanceof LineGrantedAuthority){
                if(a.getAuthority().equals("ADMIN") && ((LineGrantedAuthority) a).getLineNames().contains(lineName)){
                    canView = true;
                    break;
                }
            }
            else{
                if(a.getAuthority().equals("SYSTEM_ADMIN")){
                    canView = true;
                    break;
                }
            }
        }

        if(!canView){
            /*
             * For each shift retrieved, hide the availabilities of other companions (privacy)
             * but, if present, keep the user's availability (can be used in front end).
             * Only the system admin / admin for that line can view the availabilities.
             * */
            for(Shift s: shifts){
                if(s.getAvailabilities().contains(usr.getId())){
                    ArrayList<ObjectId> availabilities = new ArrayList<>();
                    availabilities.add(usr.getId());
                    s.setAvailabilities(availabilities);
                }
                else
                    s.setAvailabilities(null);
            }
        }
        return shifts;
    }

    @RequestMapping(value = "/availability", method = RequestMethod.POST)
    public String postAvailability(@RequestBody ShiftRequestDTO[] shiftRequestDTOs){
        return null;
    }


}
