package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation,String> {
    //void deleteByLineDataId(String line_name, String data, ObjectId id);

    void deleteById(ObjectId id);
    List<Reservation> findByData(String data);

    @Query("{'data' : ?0}")
    List<Reservation> findReservationByData(String data);

//    @Query(value = "{id:?0}")
//    Reservation findReservationByLineDataId(ObjectId id, String line_name, String data);
    //Reservation getListFromLineAndData(String line_name, String data);
}

