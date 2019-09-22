package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.security.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    private final DateTimeFormatter fmt;

    public ReservationService(ReservationRepository reservationRepository, DateTimeFormatter fmt, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.fmt = fmt;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public HashMap<String, ArrayList<HashMap<String, ArrayList<String>>>> getAllReservationStops(String lineName, String dateString) {

        LocalDate date = LocalDate.parse(dateString, fmt);

        //ovvero <"Sale o Scende", <"Nome Fermata", [Lista di gente che sale o scende]>>
        HashMap<String, ArrayList<HashMap<String, ArrayList<String>>>> mappazza = new HashMap<>();

        //<Fermata,<ListaBambini>>
        ArrayList<HashMap<String, ArrayList<String>>> o = new ArrayList<>();
        ArrayList<HashMap<String, ArrayList<String>>> b = new ArrayList<>();

        List<Reservation> listReservation = reservationRepository.findByLineNameAndDate(lineName, date);
        for (Reservation res : listReservation) {
            // Ugly repetition, but that's it for now.
            if (res.getDirection() == Reservation.Direction.OUTWARD) {
                while (res.getTripIndex() >= o.size()) {
                    o.add(new HashMap<>());
                    System.err.println(o.size());
                }
                for (String child : res.getChildName())
                    o.get(res.getTripIndex()).computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(child);
            } else if (res.getDirection() == Reservation.Direction.BACK) {
                while (res.getTripIndex() >= b.size()) {
                    b.add(new HashMap<>());
                }
                for (String child : res.getChildName())
                    b.get(res.getTripIndex()).computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(child);
            }
        }

        mappazza.put("outward", o);
        mappazza.put("backward", b);

        // We don't need to cast a JSONObject since we are in a RESTController and the serialization is automagic.
        return mappazza;
    }

    public Reservation insertReservationUser(String lineName, String dateString, ReservationDTO resd) {
        ObjectId user;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            user = getUserId();
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }

        LocalDate date = LocalDate.parse(dateString, fmt);
        // The stop is now identified by a line, a direction, and a trip index.

        for (String child : resd.getChild()) {
            boolean check = false;

            for (Child c: userRepository.getById(user).getChildren()) {
                if (c.getName().equals(child)) {
                    check = true;
                    break;
                }
            }
            if (!check)
                throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);

            for(Reservation res : reservationRepository.findByLineNameAndDateAndUser(lineName, date, user)){
                if(res.getDirection()==resd.getDirection()){
                    for(String c : res.getChildName()){
                        if(c.equals(child))
                            throw new HttpClientErrorException(HttpStatus.CONFLICT);
                    }
                }
            }
        }

        Reservation res = Reservation.builder()
                .date(date)
                .lineName(lineName)
                .user(user)
                .stopName(resd.getStopName())
                .childName(resd.getChild())
                .direction(resd.getDirection())
                .tripIndex(resd.getTripIndex())
                .build();
        reservationRepository.insert(res);
        return res;
    }

    private ObjectId getUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((CustomUserDetails) principal).getUsername();
        return userRepository.findByEmail(username).getId();
    }

    public void updateReservation(String line, String dateString, ReservationDTO resd, ObjectId id) {
        LocalDate date = LocalDate.parse(dateString, fmt);
        if (reservationRepository.findByLineNameAndDateAndId(line, date, id) == null)
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);

        Reservation res = Reservation.builder()
                .date(date)
                .lineName(line)
                .stopName(resd.getStopName())
                .childName(resd.getChild())
                .direction(resd.getDirection())
                .tripIndex(resd.getTripIndex())
                .build();
        res.setId(id);
        reservationRepository.save(res);
    }

    public void deleteReservation(String line, String dateString, ObjectId id) {
        LocalDate date = LocalDate.parse(dateString, fmt);
        if (reservationRepository.findByLineNameAndDateAndId(line, date, id) == null)
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        reservationRepository.deleteById(id);
    }

    public Reservation getReservation(ObjectId id) {
        //Should be one element
        return reservationRepository.findById(id);
    }

    public List<Reservation> getAllUserReservations() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            ObjectId user = getUserId();
            return reservationRepository.findByUser(user);
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }
    }

    public List<Reservation> getUserReservationsByDateAndLine(String lineName, String dateString) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            LocalDate date = LocalDate.parse(dateString, fmt);
            return reservationRepository.findByLineNameAndDateAndUser(lineName, date, getUserId());
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }
    }

    public void updateReservationUser(String line, String dateString, ReservationDTO resd, ObjectId id) {
        Reservation res = reservationRepository.findById(id);
        if (res != null && res.getUser().equals(getUserId())) {
            updateReservation(line, dateString, resd, id);
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }
    }

    public void deleteReservationUser(String line, String date, ObjectId id) {
        Reservation res = reservationRepository.findById(id);
        if (res != null && res.getUser().equals(getUserId())) {
            deleteReservation(line, date, id);
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }

    }

    public Reservation getReservationUser(String line, String dateString, ObjectId id) {
        LocalDate date = LocalDate.parse(dateString, fmt);
        Reservation res = reservationRepository.findByLineNameAndDateAndId(line, date, id);
        if (res != null && res.getUser().equals(getUserId())) {
            return getReservation(id);
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }
    }
}
