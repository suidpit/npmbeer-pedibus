package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Line;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LinesRepository extends MongoRepository<Line, String> {
    Line findBy_id(ObjectId _id);
}