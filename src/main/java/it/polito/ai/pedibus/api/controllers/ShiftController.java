package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.ShiftRequestDTO;
import it.polito.ai.pedibus.api.exceptions.*;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;
import it.polito.ai.pedibus.api.services.LineService;
import it.polito.ai.pedibus.api.services.ReservationService;
import it.polito.ai.pedibus.api.services.ShiftService;
import it.polito.ai.pedibus.api.services.UserService;
import it.polito.ai.pedibus.security.CustomUserDetails;
import it.polito.ai.pedibus.security.LineGrantedAuthority;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/admin/shifts")
public class ShiftController {

    private final ShiftRepository shiftRepository;
    private final LineService lineService;
    private final ShiftService shiftService;
    private final UserService userService;

    private ReservationService reservationService;
    @Qualifier("fmt")
    private final DateTimeFormatter fmt;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    public ShiftController(ShiftRepository shiftRepository, LineService lineService,
                           ShiftService shiftService, UserService userService,
                           ReservationService reservationService,
                           DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.lineService = lineService;
        this.shiftService = shiftService;
        this.userService = userService;
        this.reservationService = reservationService;
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
    @RequestMapping(value = "/by-date/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsOnDate(@PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        List<Shift> shifts = this.shiftService.getShiftsByDateAndCompanionId(date, userId);

        return purgeShifts(shifts);
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/assigned/{date}/{id}", method = RequestMethod.GET)
    public List<Shift> getShiftsByIdAndAfterDate(@PathVariable("date") String dateString,
                                                 @PathVariable("id") String idString){

        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        ObjectId userId = usr.getId();
        ObjectId id = new ObjectId(idString);

        if(!userId.equals(id)){
            throw new DeniedOperationException();
        }

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = this.shiftService.getAllShiftsAfterDateByCompanionId(date, userId);

        return purgeShifts(shifts);
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public List<Shift> getShiftsByLineAndDate(@PathVariable("lineName") String lineName,
                                 @PathVariable("date") String dateString){

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Shift> shifts = shiftRepository.findByDateGreaterThanEqualAndLineName(lineName, date);

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
                s.setDefaultCompanion(l.getAdmin_email());
                s.setCompanionId(null);
                s.setOpen(true);
                s.setDirection(sDTO.getDirection());
                s.setTripIndex(sDTO.getTripIndex());

                // setting starting and ending stops
                if(s.getDirection() == Reservation.Direction.BACK){
                    s.setFrom(l.getBack().get(s.getTripIndex()).get(0));
                    // Take last stop
                    s.setTo(l.getBack().get(s.getTripIndex()).get(l.getBack().get(s.getTripIndex()).size()-1));
                }
                else{
                    s.setFrom(l.getOutward().get(s.getTripIndex()).get(0));
                    s.setTo(l.getOutward().get(s.getTripIndex()).get(l.getOutward().get(s.getTripIndex()).size()-1));
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

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/cancel_availability", method = RequestMethod.POST)
    public void cancelAvailability(@RequestBody ShiftRequestDTO shiftRequestDTO){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());

        ObjectId userId = usr.getId();
        Shift s;
        // Shift was in db already
        if(shiftRequestDTO.getShiftId() != null){
            s = this.shiftService.getShiftById(shiftRequestDTO.getShiftId());
            if(s != null){
                if(s.getCompanionId() != null && s.getCompanionId().equals(userId)){
                    // cannot cancel availability if you were assigned to shift
                    throw new DeniedOperationException();
                }
                List<ObjectId> availabilities = s.getAvailabilities();
                availabilities.remove(userId);
                s.setAvailabilities(availabilities);
                this.shiftService.insertOrUpdateShift(s);
            }
        }
        else{
            throw new WrongFormatException();
        }
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/confirm", headers = "Accept=application/json", method = RequestMethod.POST)
    public void postShiftConfirmation(@RequestBody @Valid ShiftRequestDTO shiftRequestDTO){
        // TODO send notification to user.
        if(canView(shiftRequestDTO.getLineName())){
            if(shiftRequestDTO.getShiftId() != null){
                Shift s = this.shiftService.getShiftById(shiftRequestDTO.getShiftId());
                User u = this.userService.getUserByEmail(shiftRequestDTO.getAssignedCompanionEmail());
                if(u != null){
                    s.setCompanionId(u.getId());
                    s.setOpen(true);
                    if(shiftRequestDTO.getTo() == null || shiftRequestDTO.getTo().hasNullFields() || s.getTo().equals(shiftRequestDTO.getTo())){
                        this.shiftService.insertOrUpdateShift(s);
                    }
                    else{
                        // create complementary shift.
                        try{
                            Shift complementary_shift = (Shift) s.clone();
                            complementary_shift.setId(null);
                            complementary_shift.setCompanionId(null);
                            complementary_shift.setFrom(shiftRequestDTO.getTo());
                            s.setTo(shiftRequestDTO.getTo());
                            this.shiftService.insertOrUpdateShift(s);
                            this.shiftService.insertOrUpdateShift(complementary_shift);
                        }
                        catch(Exception e){
                            // TODO create complementary shift anew (no clone).
                        }
                    }
                }
                else{
                    throw new NoSuchUserException();
                }
            }
            else{
                throw new WrongFormatException();
            }
        }
        else{
            throw new UnauthorizedLineActionException();
        }
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/toggle-open", headers = "Accept=application/json", method = RequestMethod.POST)
    public void postOpenCloseShift(@RequestBody ShiftRequestDTO[] shiftRequestDTOs){
        for(ShiftRequestDTO sDTO: shiftRequestDTOs){
            try {
                Shift s = this.shiftService.getShiftById(sDTO.getShiftId());
                if(this.canView(s.getLineName())){
                    if(s.getCompanionId()!=null){
                        s.setOpen(sDTO.isOpen());
                        // TODO improve by using saveAll => one db query only.
                        this.shiftService.insertOrUpdateShift(s);
                    }
                    else{
                        throw new DeniedOperationException();
                    }
                }
                else {
                    throw new UnauthorizedLineActionException();
                }
            }
            catch(NullPointerException e){
                throw new WrongFormatException();
            }
        }
    }

    @RequestMapping(value = "by-resid/{resid}", method = RequestMethod.GET)
    public List<String> getShiftIdByReservationId(@PathVariable("resid") String resid){
        Reservation res = reservationService.getReservation(new ObjectId(resid));

        List<Shift> shifts = shiftService.getShiftsByAllFields(res.getDate(), res.getLineName(),
                res.getDirection(), res.getTripIndex()); // TODO may return null -> handle

        if(shifts != null){
            ArrayList<String> objectIds = new ArrayList<>();
            for(Shift s: shifts){
                objectIds.add(s.getId().toString());
            }
            return objectIds;
        }
        return null;
    }

    private List<Shift> purgeShifts(List<Shift> shifts){
        CustomUserDetails usr = ((CustomUserDetails)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());
        /*
         * For each shift retrieved, hide the availabilities$ of utils companions (privacy)
         * but, if present, keep the user's availability (can be used in front end).
         * Only the system admin / admin for that line can view the availabilities$.
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
