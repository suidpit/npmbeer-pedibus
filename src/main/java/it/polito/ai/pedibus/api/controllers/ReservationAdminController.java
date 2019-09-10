package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.constraints.ReservationPutFields;
import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.services.ReservationService;
import org.bson.types.ObjectId;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    public HashMap<String, ArrayList<HashMap<String, ArrayList<String>>>> getAllChildsForStop(@PathVariable("lineName") String lineName,
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
}
