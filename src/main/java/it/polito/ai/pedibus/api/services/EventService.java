package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.NewEventDTO;
import it.polito.ai.pedibus.api.models.Event;
import it.polito.ai.pedibus.api.repositories.EventRepository;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.sql.Timestamp;
import java.util.Date;

import static org.springframework.web.reactive.function.server.ServerResponse.notFound;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Service
public class EventService {
    private EventRepository eventRepository;


    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Mono<Event> pushNewEvent(NewEventDTO newEventDTO){
        Event e = Event.builder()
                .body(newEventDTO.getBody())
                .type(newEventDTO.getType())
                .userId(newEventDTO.getUserId())
                .read(false)
                .created_at(new Timestamp(new Date().getTime()))
                .objectReferenceId(newEventDTO.getObjectReferenceId())
                .build();

        return eventRepository.save(e);
    }

    public Flux<Event> getEventsForUser(ObjectId userId) {
        return eventRepository.findWithTailableCursorByUserId(userId);
    }

    public Mono<Event> getByReferenceObject(ObjectId objectId){
        return this.eventRepository.findByObjectReferenceId(objectId);
    }

    public Mono<Event> setRead(String notId) {
        Mono<Event> eventMono = this.eventRepository.findById(notId);
        return eventMono
                .map(notification -> Event.builder()
                    .body(notification.getBody())
                    .type(notification.getType())
                    .read(true)
                    .created_at(notification.getCreated_at())
                    .userId(notification.getUserId())
                    .objectReferenceId(notification.getObjectReferenceId())
                    .id(notification.getId())
                    .build())
                .flatMap(updatedNotification -> this.eventRepository.save(updatedNotification));
    }
}
