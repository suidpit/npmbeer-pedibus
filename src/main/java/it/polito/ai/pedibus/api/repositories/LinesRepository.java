package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Line;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LinesRepository extends MongoRepository<Line, String> {
    Line findByName(String name);
}