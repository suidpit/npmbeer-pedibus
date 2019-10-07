package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.ChildRepository;
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
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;

    private final DateTimeFormatter fmt;

    public ReservationService(ReservationRepository reservationRepository, DateTimeFormatter fmt,
                              UserRepository userRepository, ChildRepository childRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.fmt = fmt;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public HashMap<String, ArrayList<HashMap<String, ArrayList<HashMap<String, Object>>>>> getAllReservationStops(String lineName, String dateString) {

        LocalDate date = LocalDate.parse(dateString, fmt);

        //ovvero <"Sale o Scende", <"Nome Fermata", [Lista di gente che sale o scende]>>
        HashMap<String, ArrayList<HashMap<String, ArrayList<HashMap<String, Object>>>>> mappazza = new HashMap<>();

        //<Fermata,<ListaBambini>>
        ArrayList<HashMap<String, ArrayList<HashMap<String, Object>>>> outward = new ArrayList<>();
        ArrayList<HashMap<String, ArrayList<HashMap<String, Object>>>> back = new ArrayList<>();

        List<Reservation> listReservation = reservationRepository.findByLineNameAndDate(lineName, date);
        for (Reservation res : listReservation) {
            Child c = childRepository.getById(res.getChildId());
            // Ugly repetition, but that's it for now.
            if (res.getDirection() == Reservation.Direction.OUTWARD) {
                while (res.getTripIndex() >= outward.size()) {
                    outward.add(new HashMap<>());
                }
                HashMap<String, Object> childReservationInfo = getChildReservationInfo(res.getChildId(), c.getName(), res.getId(), res.isPresent(), res.getCompanionWhoInserted());
                outward.get(res.getTripIndex()).computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(childReservationInfo);
            } else if (res.getDirection() == Reservation.Direction.BACK) {
                while (res.getTripIndex() >= back.size()) {
                    back.add(new HashMap<>());
                }

                HashMap<String, Object> childReservationInfo = getChildReservationInfo(res.getChildId(), c.getName(), res.getId(), res.isPresent(), res.getCompanionWhoInserted());
                back.get(res.getTripIndex()).computeIfAbsent(res.getStopName(), k -> new ArrayList<>()).add(childReservationInfo);
            }
        }

        mappazza.put("outward", outward);
        mappazza.put("backward", back);

        // We don't need to cast a JSONObject since we are in a RESTController and the serialization is automagic.
        return mappazza;
    }

    private HashMap<String, Object> getChildReservationInfo(ObjectId childId, String childName, ObjectId resid, Boolean isPresent, ObjectId companionWhoInserted){
        HashMap<String, Object> childReservationInfo = new HashMap<>();
        childReservationInfo.put("id", childId.toString());
        childReservationInfo.put("name", childName);
        childReservationInfo.put("resid", resid.toString());
        childReservationInfo.put("isPresent", isPresent);
        childReservationInfo.put("companionWhoInserted", companionWhoInserted!=null?companionWhoInserted.toString():null);
        return childReservationInfo;
    }

    public List<Reservation> insertReservationUser(String lineName, String dateString, ReservationDTO resd) {
        ObjectId user;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            user = getUserId();
        } else {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }

        LocalDate date = LocalDate.parse(dateString, fmt);
        // The stop is now identified by a line, a direction, and a trip index.

        for (ObjectId child : resd.getChild()) {
            boolean check = false;

            for (ObjectId c: userRepository.getById(user).getChildren()) {
                if (childRepository.getById(c).getId().equals(child)) {
                    check = true;
                    break;
                }
            }
            if (!check)
                throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);

            /*for(Reservation res : reservationRepository.findByLineNameAndDateAndUser(lineName, date, user)){
                if(res.getDirection()==resd.getDirection()){
                    for(ObjectId c : res.getChildId()){
                        if(c.equals(child))
                            throw new HttpClientErrorException(HttpStatus.CONFLICT);
                    }
                }
            }*/
            if(this.reservationRepository.findAllByDateAndLineNameAndDirectionAndChildId(
                    date, lineName, resd.getDirection(), resd.getTripIndex(), child).size()>0)
                throw new HttpClientErrorException(HttpStatus.CONFLICT);
        }
        List<Reservation> reservations = new ArrayList<Reservation>();
        for(ObjectId childId: resd.getChild()){
            Reservation res = Reservation.builder()
                    .date(date)
                    .lineName(lineName)
                    .user(user)
                    .stopName(resd.getStopName())
                    .childId(childId)
                    .direction(resd.getDirection())
                    .tripIndex(resd.getTripIndex())
                    .build();
            reservationRepository.insert(res);
            reservations.add(res);
        }
        return reservations;
    }

    private ObjectId getUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((CustomUserDetails) principal).getUsername();
        return userRepository.findByEmail(username).getId();
    }

    public void updateReservation(String line, String dateString, ReservationDTO resd, ObjectId id) {
        LocalDate date = LocalDate.parse(dateString, fmt);
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Reservation res = reservationRepository.findByDateAndDirectionAndUser(date, resd.getDirection(), id);
        if ( res == null ) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
        if(!res.getUser().equals(userId)){
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        }
        res.setStopName(resd.getStopName());
        res.setTripIndex(resd.getTripIndex());
        res.setLineName(line);
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

    public List<Reservation> getUserReservationsByDate(String dateString) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            LocalDate date = LocalDate.parse(dateString, fmt);
            return reservationRepository.findByDateAndUser(date, getUserId());
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

    public Reservation getReservationByAllParams(ObjectId userId, String lineName, Integer tripIndex,
                                                 Reservation.Direction direction, LocalDate date){
        return this.reservationRepository.findFirstByLineNameAndDateAndTripIndexAndDirectionAndUser(
                lineName,
                date,
                tripIndex,
                direction,
                userId);
    }

    public List<Reservation> getReservationsByDateAndUser(LocalDate date, ObjectId userId){
        return this.reservationRepository.findByUserAndDate(userId, date);
    }

    public List<String> notReservedChildrenOnTrip(String dateString, String lineName,
                                                    Reservation.Direction direction, Integer tripIndex){
        LocalDate date = LocalDate.parse(dateString, this.fmt);
        List<Reservation> reservations = this.reservationRepository.findAllByDateAndLineNameAndDirectionAndTripIndex(date, lineName, direction, tripIndex);
        return this.childRepository.findAll()
                .stream()
                .filter(child ->{
                    boolean filter_in = true;
                    for(Reservation res: reservations){
                        if(res.getChildId().equals(child.getId())){
                            filter_in = false;
                            break;
                        }
                    }
                    return filter_in;
                })
                .map(c -> c.getId().toString())
                .collect(Collectors.toList());
    }

    public void togglePresenceOnReservation(ObjectId resid){
        Reservation res = this.reservationRepository.findById(resid);
        if(res == null){
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
        res.setPresent(!res.isPresent());
        this.reservationRepository.save(res);
    }

    public Reservation addOnTheFlyChild(String dateString, String lineName,Reservation.Direction direction,
                                        Integer tripIndex, String stopName, ObjectId childId){

        if(childId == null || dateString == null || direction == null || tripIndex == null || stopName == null){
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        LocalDate date = LocalDate.parse(dateString, this.fmt);
        ObjectId companion = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Reservation res = Reservation.builder()
                .childId(childId)
                .lineName(lineName)
                .direction(direction)
                .stopName(stopName)
                .tripIndex(tripIndex)
                .companionWhoInserted(companion)
                .date(date)
                .present(true)
                .build();
        return this.reservationRepository.insert(res);
    }
}
