package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    private final DateTimeFormatter fmt;

    public ReservationService(ReservationRepository reservationRepository, DateTimeFormatter fmt) {
        this.reservationRepository = reservationRepository;
        this.fmt = fmt;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public HashMap<String, ArrayList<HashMap<String, ArrayList<String>>>> getReservationStops(String lineName, String dateString) {

        LocalDate date = LocalDate.parse(dateString, fmt);

        //ovvero <"Sale o Scende", <"Nome Fermata", [Lista di gente che sale o scende]>>
        HashMap<String, ArrayList<HashMap<String, ArrayList<String>>>> mappazza = new HashMap<>();

        //<Fermata,<ListaBambini>>
        ArrayList<HashMap<String,ArrayList<String>>> o = new ArrayList<>();
        ArrayList<HashMap<String,ArrayList<String>>> b = new ArrayList<>();

        List<Reservation> listReservation = reservationRepository.findByLineNameAndDate(lineName, date);
        for (Reservation res : listReservation) {
            // Ugly repetition, but that's it for now.
            if (res.getDirection() == Reservation.Direction.OUTWARD) {
                while(res.getTripIndex()>=o.size()){
                    o.add(new HashMap<>());
                    System.err.println(o.size());
                }
                o.get(res.getTripIndex()).computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(res.getChildName());
            } else if (res.getDirection() == Reservation.Direction.BACK) {
                while(res.getTripIndex()>=b.size()){
                    b.add(new HashMap<>());
                }
                b.get(res.getTripIndex()).computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(res.getChildName());
            }
        }

        mappazza.put("outward", o);
        mappazza.put("backward", b);

        // We don't need to cast a JSONObject since we are in a RESTController and the serialization is automagic.
        return mappazza;
    }

    public String insertReservation(String lineName, String dateString, ReservationDTO resd) {

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
        return res.getId().toString();
    }

    public void updateReservation(String lineName, String dateString, ReservationDTO resd, ObjectId id) {
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

    public void deleteReservation(String lineName, String dateString, ObjectId id) {
        LocalDate date = LocalDate.parse(dateString, fmt);
        reservationRepository.deleteByIdAndLineNameAndDate(id, lineName, date);
    }

    public Reservation getReservation(String lineName, String dateString, ObjectId id) {
        LocalDate date = LocalDate.parse(dateString, fmt);
        //Should be one element
        Reservation res = reservationRepository.findByLineNameAndDateAndId(lineName, date, id);
        return res;
    }
}
