package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Child;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChildRepository extends MongoRepository<Child,String> {

}
