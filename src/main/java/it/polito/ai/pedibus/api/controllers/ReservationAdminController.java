package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.services.ReservationService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/reservations/admin")
public class ReservationAdminController {

    private final ReservationService reservationService;

    public ReservationAdminController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    /**
     * GET /reservations/admin/{nome_linea}/{data} –> Restituisce un oggetto JSON contenente due liste,
     * riportanti, per ogni fermata di andata e ritorno, lelenco delle persone che devono essere
     * prese in carico / lasciate in corrispondenza della fermata.
     *
     * @param lineName
     * @param dateString
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public HashMap<String, ArrayList<HashMap<String, ArrayList<HashMap<String, Object>>>>> getAllChildsForStop(@PathVariable("lineName") String lineName,
                                                                                              @PathVariable("date") String dateString) {
        return reservationService.getAllReservationStops(lineName, dateString);
    }

    /**
     * GET /reservations/admin/{nome_linea}/{data}/{reservation_id} – restituisce la prenotazione
     *
     * @param id
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Reservation getReservation(@PathVariable("id") ObjectId id) {

        return reservationService.getReservation(id);
    }


    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "not-reserved/{date}/{lineName}/{direction}/{tripIndex}", method = RequestMethod.GET)
    public List<String> getNotReservedChildren(@PathVariable("date") String dateString,
                                                 @PathVariable("lineName") String lineName,
                                                 @PathVariable("direction") String direction,
                                                 @PathVariable("tripIndex") Integer tripIndex){

        return this.reservationService.notReservedChildrenOnTrip(
                dateString, lineName,
                Reservation.Direction.valueOf(direction.toUpperCase()), tripIndex);
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "presence/{resid}", method = RequestMethod.POST)
    public void toggleReservationPresence(@PathVariable("resid") String resid){
        try{
            this.reservationService.togglePresenceOnReservation(new ObjectId(resid));
        }
        catch(Exception e){
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('SYSTEM_ADMIN') or hasAuthority('ADMIN') or hasAuthority('COMPANION')")
    @RequestMapping(value = "add-on-the-fly/{lineName}/{dateString}", method = RequestMethod.POST)
    public void addOnTheFlyChild(@PathVariable("lineName") String lineName,
                                 @PathVariable("dateString") String dateString,
                                 @RequestBody ReservationDTO reservationDTO){
        try{
            this.reservationService.addOnTheFlyChild(
                    dateString, lineName,
                    reservationDTO.getDirection(),
                    reservationDTO.getTripIndex(),
                    reservationDTO.getStopName(),
                    reservationDTO.getChild());
        }
        catch(Exception e){
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }
    }

}
