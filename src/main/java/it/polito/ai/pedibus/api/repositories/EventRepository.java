package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Event;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface EventRepository extends ReactiveMongoRepository<Event, String> {
    @Tailable
    public Flux<Event> findWithTailableCursorBy();
}
