package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    Reservation findById(ObjectId resId);
    List<Reservation> findByLineNameAndDate(String lineName, LocalDate date);
    Reservation findByLineNameAndDateAndId(String lineName, LocalDate date, ObjectId objectId);
    void deleteByIdAndLineNameAndDate(ObjectId id, String lineName, LocalDate date);
}

