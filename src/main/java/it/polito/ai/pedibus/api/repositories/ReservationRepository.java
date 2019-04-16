package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByLineNameAndDate(String lineName, String date);
    Reservation findByLineNameAndDateAndId(String lineName, String date, ObjectId objectId);
    void deleteByIdAndLineNameAndDate(ObjectId id, String lineName, String date);
}

