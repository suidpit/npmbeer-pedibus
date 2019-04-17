package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.constraints.ReservationPostFields;
import it.polito.ai.pedibus.api.constraints.ReservationPutFields;
import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import org.apache.tomcat.jni.Local;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Validated
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private LinesRepository linesRepository;

    //TODO: delete this
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<Reservation> getReservations() {
        return reservationRepository.findAll();
    }

    /**
     * GET /reservations/{nome_linea}/{data} –> Restituisce un oggetto JSON contenente due liste,
     * riportanti, per ogni fermata di andata e ritorno, l’elenco delle persone che devono essere
     * prese in carico / lasciate in corrispondenza della fermata.
     *
     * @param lineName -> Il nome della linea.
     * @param dateString     -> La data della ricerca.
     * @return
     */
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public HashMap<String, HashMap<String, ArrayList<String>>> getChildsForStop(@PathVariable("lineName") String lineName,
                                                                                @PathVariable("date") String dateString) {

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("ddMMyyyy");
        LocalDate date = LocalDate.parse(dateString, fmt);

        //ovvero <"Sale o Scende", <"Nome Fermata", [Lista di gente che sale o scende]>>
        HashMap<String, HashMap<String, ArrayList<String>>> mappazza = new HashMap<>();

        //<Fermata,<ListaBambini>>
        HashMap<String, ArrayList<String>> innerMapOut = new HashMap<>();
        HashMap<String, ArrayList<String>> innerMapBack = new HashMap<>();

        List<Reservation> listReservation = reservationRepository.findByLineNameAndDate(lineName, date);
        for (Reservation res : listReservation) {
            // Ugly repetition, but that's it for now.
            if (res.getDirection() == Reservation.Direction.OUTWARD) {
                innerMapOut.computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(res.getChildName());
            } else if (res.getDirection() == Reservation.Direction.BACK) {
                innerMapBack.computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(res.getChildName());
            }
        }

        mappazza.put("Outward", innerMapOut);
        mappazza.put("Backward", innerMapBack);

        // We don't need to cast a JSONObject since we are in a RESTController and the serialization is automagic.
        return mappazza;
    }

    //TODO: Change this to return a JSON?

    /**
     * POST /reservations/{nome_linea}/{data} – invia un oggetto JSON contenente il nome
     * dell’alunno da trasportare, l’identificatore della fermata a cui sale/scende e il verso di
     * percorrenza (andata/ritorno); restituisce un identificatore univoco della prenotazione
     * creata
     */
    @ReservationPostFields
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.POST)
    public ObjectId insert(@PathVariable("lineName") String lineName,
                         @PathVariable("date") String dateString,
                         @RequestBody ReservationDTO resd) {

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("ddMMyyyy");
        LocalDate date = LocalDate.parse(dateString, fmt);
        // The stop is now identified by a line, a direction, and a trip index.
        Reservation res = Reservation.builder()
                .date(date)
                .lineName(lineName)
                .stopName(resd.getStopName())
                .childName(resd.getChild())
                .direction(resd.getDirection())
                .tripIndex(resd.getTripIndex())
                .build();
        reservationRepository.insert(res);
        return res.getId();
    }


    @ReservationPutFields
    @RequestMapping(value = "/{lineName}/{date}/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable("lineName") String lineName,
                       @PathVariable("date") String dateString,
                       @PathVariable("id") ObjectId id,
                       @RequestBody ReservationDTO resd) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("ddMMyyyy");
        LocalDate date = LocalDate.parse(dateString, fmt);
        Reservation res = Reservation.builder()
                .date(date)
                .lineName(lineName)
                .stopName(resd.getStopName())
                .childName(resd.getChild())
                .direction(resd.getDirection())
                .tripIndex(resd.getTripIndex())
                .build();
        res.setId(id);
        reservationRepository.save(res);
    }

    /**
     * DELETE /reservations/{nome_linea}/{data}/{reservation_id} – elimina la prenotazione
     * indicata.
     *
     * @param lineName
     * @param dateString
     * @param id
     */
    @RequestMapping(value = "/{lineName}/{date}/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("lineName") String lineName,
                       @PathVariable("date") String dateString,
                       @PathVariable("id") ObjectId id) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("ddMMyyyy");
        LocalDate date = LocalDate.parse(dateString, fmt);
        this.reservationRepository.deleteByIdAndLineNameAndDate(id, lineName, date);
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

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("ddMMyyyy");
        LocalDate date = LocalDate.parse(dateString, fmt);
        //Should be one element
        Reservation res = reservationRepository.findByLineNameAndDateAndId(lineName, date, id);
        return res;
    }

    @ExceptionHandler(Exception.class)
    public String handleException(final Exception e) {
        return "forward/serverError";
    }
}
