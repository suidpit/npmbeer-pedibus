package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.apache.tomcat.jni.Local;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByLineNameAndDate(String lineName, LocalDate date);
    Reservation findById(ObjectId objectId);
    Reservation findByLineNameAndDateAndId(String linename, LocalDate date, ObjectId id);
    void deleteById(ObjectId id);

    List<Reservation> findByLineNameAndDateAndUser(String linename, LocalDate date, ObjectId user);
    List<Reservation> findByUser(ObjectId user);

}

