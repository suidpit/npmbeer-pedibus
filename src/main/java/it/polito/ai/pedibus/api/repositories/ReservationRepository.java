package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation,String> {
    //void deleteByLineDataId(String line_name, String data, ObjectId id);

    void deleteById(ObjectId id);
    //Reservation getListFromLineAndData(String line_name, String data);
}
