package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation,String> {
    //void deleteByLineDataId(String line_name, String data, ObjectId id);

    void deleteById(ObjectId id);
    List<Reservation> findByData(String data);
    @Query("{'id' : ?0 , 'line_name' : ?1 , 'data' : ?2}")
    Reservation findReservationByLineDataId(ObjectId id, String line_name, String data);


    @Query("{'data' : ?0}")
    List<Reservation> findReservationByData(String data);


}

