package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Stop;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StopsRepository extends MongoRepository<Stop, String> {
    Stop findBy_id(ObjectId _id);
}
