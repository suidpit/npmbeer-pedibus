package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.ShiftRequestDTO;
import it.polito.ai.pedibus.api.exceptions.LineNotExistingException;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;
import it.polito.ai.pedibus.api.services.LineService;
import it.polito.ai.pedibus.api.services.ShiftService;
import it.polito.ai.pedibus.security.CustomUserDetails;
import it.polito.ai.pedibus.security.LineGrantedAuthority;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final LineService lineService;
    private final ShiftService shiftService;

    @Qualifier("fmt")
    private final DateTimeFormatter fmt;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    public ShiftController(ShiftRepository shiftRepository, LineService lineService, ShiftService shiftService, DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.lineService = lineService;
        this.shiftService = shiftService;
        this.fmt = fmt;
    }



    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsAfterDate(@PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = this.shiftService.getAllShiftAfterDate(date);

        return purgeShifts(shifts);
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsByLineAndDate(@PathVariable("lineName") String lineName,
                                 @PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = shiftRepository.findByDateAfterAndLineName(lineName, date);

        return purgeShifts(shifts);
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/availability", method = RequestMethod.POST)
    public ArrayList<String> postAvailability(@RequestBody ShiftRequestDTO[] shiftRequestDTOs){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        ObjectId userId = usr.getId();
        ArrayList<String> ids = new ArrayList<>();

        for(ShiftRequestDTO sDTO: shiftRequestDTOs){
            Shift s;
            // Shift was in db already
            if(sDTO.getShiftId() != null){
                s = this.shiftService.getShiftById(sDTO.getShiftId());
                List<ObjectId> availabilities = s.getAvailabilities();
                if(!availabilities.contains(userId)){
                    availabilities.add(userId);
                }
                s.setAvailabilities(availabilities);
            }
            // Shift to be added in db yet
            else{
                s = new Shift();
                Line l = this.lineService.getLine(sDTO.getLineName());

                if(l == null){
                    throw new LineNotExistingException();
                }

                s.setLineName(sDTO.getLineName());
                s.setDate(sDTO.getDate());
                s.setCompanionId(null);
                s.setOpen(true);
                s.setDirection(sDTO.getDirection());
                s.setTripIndex(sDTO.getTripIndex());

                // setting starting and ending stops
                if(s.getDirection() == Shift.Direction.BACK){
                    s.setFrom(l.getBack().get(s.getTripIndex()).get(0));
                    // Take last stop
                    s.setTo(l.getBack().get(s.getTripIndex()).get(l.getBack().get(s.getTripIndex()).size()-1));
                }
                else{
                    s.setFrom(l.getOutward().get(s.getTripIndex()).get(l.getOutward().get(s.getTripIndex()).size()-1));
                    s.setTo(l.getOutward().get(s.getTripIndex()).get(0));
                }

                ArrayList<ObjectId> availabilities = new ArrayList<>();
                availabilities.add(userId);

                s.setAvailabilities(availabilities);
            }
            ObjectId id = this.shiftService.insertOrUpdateShift(s).getId();

            ids.add(id.toString());
        }
        return ids;
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @RequestMapping(value = "/confirm", method = RequestMethod.POST)
    public void postShiftConfirmation(){
        // TODO remember to check if it is admin for that line.
    }

    private List<Shift> purgeShifts(List<Shift> shifts){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        /*
         * For each shift retrieved, hide the availabilities of other companions (privacy)
         * but, if present, keep the user's availability (can be used in front end).
         * Only the system admin / admin for that line can view the availabilities.
         * */
        for(Shift s: shifts){
            if(!canView(s.getLineName())){
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

    private boolean canView(String lineName){
        boolean canView = false;
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
        return canView;
    }
}
