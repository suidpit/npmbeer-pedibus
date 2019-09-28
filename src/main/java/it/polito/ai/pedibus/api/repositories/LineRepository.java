package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Line;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LineRepository extends MongoRepository<Line, String> {
    Line findByName(String name);
}