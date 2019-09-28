package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Child;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildRepository extends MongoRepository<Child,String> {

}
