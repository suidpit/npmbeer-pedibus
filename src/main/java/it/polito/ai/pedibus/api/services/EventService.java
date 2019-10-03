package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.NewEventDTO;
import it.polito.ai.pedibus.api.models.Event;
import it.polito.ai.pedibus.api.repositories.EventRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.sql.Timestamp;
import java.util.Date;

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
}
