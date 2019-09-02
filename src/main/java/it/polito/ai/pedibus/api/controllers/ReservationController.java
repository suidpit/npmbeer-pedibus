package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.constraints.ReservationPostFields;
import it.polito.ai.pedibus.api.constraints.ReservationPutFields;
import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.LineRepository;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import it.polito.ai.pedibus.api.services.ReservationService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    //TODO: delete this
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<Reservation> getReservations() {
        return reservationService.getAllReservations();
    }

    /**
     * GET /reservations/{nome_linea}/{data} –> Restituisce un oggetto JSON contenente due liste,
     * riportanti, per ogni fermata di andata e ritorno, l’elenco delle persone che devono essere
     * prese in carico / lasciate in corrispondenza della fermata.
     *
     * @param lineName
     * @param dateString
     * @return
     */
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public HashMap<String, ArrayList<HashMap<String, ArrayList<String>>>> getChildsForStop(@PathVariable("lineName") String lineName,
                                                                                @PathVariable("date") String dateString) {
        return reservationService.getReservationStops(lineName, dateString);
    }

    //TODO: Change this to return a JSON?

    /**
     * POST /reservations/{nome_linea}/{data} – invia un oggetto JSON contenente il nome
     * dell’alunno da trasportare, l’identificatore della fermata a cui sale/scende e il verso di
     * percorrenza (andata/ritorno); restituisce un identificatore univoco della prenotazione
     * creata
     */
    @Transactional
    @ReservationPostFields
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.POST)
    public String insert(@PathVariable("lineName") String lineName,
                         @PathVariable("date") String dateString,
                         @RequestBody ReservationDTO resd) {
        return reservationService.insertReservation(lineName, dateString, resd);
    }

    /**
     * PUT /reservations/{nome_linea}/{data}/{reservation_id} – invia un oggetto JSON che
     * permette di aggiornare i dati relativi alla prenotazione indicata
     *
     * @param lineName
     * @param dateString
     * @param id
     * @param resd
     */
    @Transactional
    @ReservationPutFields
    @RequestMapping(value = "/{lineName}/{date}/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable("lineName") String lineName,
                       @PathVariable("date") String dateString,
                       @PathVariable("id") ObjectId id,
                       @RequestBody ReservationDTO resd) {

        reservationService.updateReservation(lineName, dateString, resd, id);
    }

    /**
     * DELETE /reservations/{nome_linea}/{data}/{reservation_id} – elimina la prenotazione
     * indicata.
     *
     * @param lineName
     * @param dateString
     * @param id
     */
    @Transactional
    @RequestMapping(value = "/{lineName}/{date}/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("lineName") String lineName,
                       @PathVariable("date") String dateString,
                       @PathVariable("id") ObjectId id) {
        reservationService.deleteReservation(lineName, dateString, id);
    }

    /**
     * GET /reservations/{nome_linea}/{data}/{reservation_id} – restituisce la prenotazione
     *
     * @param lineName
     * @param dateString
     * @param id
     * @return
     */
    @RequestMapping(value = "/{lineName}/{date}/{id}", method = RequestMethod.GET)
    public Reservation getReservation(@PathVariable("lineName") String lineName,
                                      @PathVariable("date") String dateString,
                                      @PathVariable("id") ObjectId id) {

        return reservationService.getReservation(lineName, dateString, id);
    }
}
