package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Qualifier("fmt")
    private final DateTimeFormatter fmt;


    public ShiftService(ShiftRepository shiftRepository, DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.fmt = fmt;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    public List<Shift> getAllShiftAfterDate(LocalDate date){
        return this.shiftRepository.findByDateGreaterThanEqual(date);
    }

    public List<Shift> getAllShiftsAfterDateByCompanionId(LocalDate date, ObjectId id){
        return this.shiftRepository.findByDateGreaterThanEqualAndCompanionId(date, id);
    }

    public Shift getShiftById(ObjectId id){ return shiftRepository.findById(id); }

    public Shift insertOrUpdateShift(Shift s){
        // if you do have a shift id, then UPDATE, no insert
        if(s.getId() != null){
            try{
                return shiftRepository.save(s);
            }
            catch (Exception e){
                logger.error(e.getLocalizedMessage());
            }
        }
        // if you don't have a shift id, check not to have an utils shift in db already with same info.
        // if so, get the id and save
        List<Shift> found = this.shiftRepository
                .findByLineNameAndDirectionAndTripIndexAndDate(
                        s.getLineName(), s.getDirection(), s.getTripIndex(), s.getDate());
        if(found != null && found.size() > 0) {
            if (found.size() > 1) {
                logger.error("found more than one shift with specified info");
                return null;
            }
            Shift found_s = found.get(0);
            if(found_s.getTo().equals(s.getTo())) { // If they have different destination, they are complementary shifts
                if (!found_s.getAvailabilities().containsAll(s.getAvailabilities())) {
                    found_s.getAvailabilities().addAll(s.getAvailabilities());
                } else
                    return found_s;
                return this.shiftRepository.save(found_s);
            }
        }

        s.setLastUpdate(s.getFrom().getPosition());
        return shiftRepository.insert(s); }

    public ObjectId getCompanionIdByShiftId(ObjectId sid){
        return this.shiftRepository.findById(sid).getCompanionId();
    }

    public List<Shift> getShiftsByDateAndCompanionId(LocalDate date, ObjectId id){
        return this.shiftRepository.findByDateAndCompanionId(date, id);
    }

    public List<Shift> getShiftsByAllFields(LocalDate date, String lineName, Reservation.Direction direction, Integer tripIndex){
        return this.shiftRepository.findByLineNameAndDirectionAndTripIndexAndDate(lineName, direction, tripIndex, date);
    }

}
