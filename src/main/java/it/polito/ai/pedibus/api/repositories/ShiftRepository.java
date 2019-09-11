package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftRepository extends MongoRepository<Shift, String> {
    List<Shift> findByLineNameAndDate(String lineName, LocalDate date);
    List<Shift> findByLineNameAndDirectionAndTripIndexAndDate(String lineName, Shift.Direction direction,
                                                         Integer tripIndex, LocalDate date);
    Shift findByLineNameAndDateAndCompanionId(String lineName, LocalDate date, ObjectId companionId);
    List<Shift> findByLineNameAndCompanionIdAndDateBetween(String lineName, LocalDate date1,
                                                           LocalDate date2, ObjectId companionId);

    List<Shift> findByDateAfterAndLineName(String lineName, LocalDate date);

    List<Shift> findByDateAfterAndCompanionId(LocalDate date, ObjectId companionId);

    List<Shift> findByDateAfter(LocalDate date);

    Shift findById(ObjectId id);
}

