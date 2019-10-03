package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Event;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface EventRepository extends ReactiveMongoRepository<Event, String> {
    @Tailable
    public Flux<Event> findWithTailableCursorBy();
    @Tailable
    public Flux<Event> findWithTailableCursorByUserId(ObjectId userId);

    public Mono<Event> findByObjectReferenceId(ObjectId objectId);
}
