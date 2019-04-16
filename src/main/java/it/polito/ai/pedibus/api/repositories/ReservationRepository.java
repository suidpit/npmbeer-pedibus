package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation,String> {

    Reservation findById(ObjectId id);

    List<Reservation> findByDate(String data);

    @Query("{'line_name' : ?0 , 'data' : ?1}")
    List<Reservation> findReservationsByLineData(String line_name, String data);

    @Query("{'id' : ?0 , 'line_name' : ?1 , 'data' : ?2}")
    Reservation findReservationByLineDataId(ObjectId id, String line_name, String data);

    @Query(value = "{'id' : ?0 , 'line_name' : ?1 , 'data' : ?2}",delete = true)
    void deleteByIdLineData(ObjectId id, String line_name, String data);



    void deleteById(ObjectId id);

    @Query("{'data' : ?0}")
    List<Reservation> findReservationByData(String data);
}

