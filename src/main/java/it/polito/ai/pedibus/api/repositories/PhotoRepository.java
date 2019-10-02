package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Photo;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PhotoRepository extends MongoRepository<Photo, String> {

    void deleteByOwner(ObjectId id);

    Photo getByOwner(ObjectId id);
}
