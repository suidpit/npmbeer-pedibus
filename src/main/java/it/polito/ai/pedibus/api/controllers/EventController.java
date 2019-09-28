package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.models.Event;
import it.polito.ai.pedibus.api.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@CrossOrigin
@RestController
@RequestMapping("/events")
public class EventController {
    private EventRepository eventRepository;

    @Autowired
    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping(value="/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Event> streamEvents(Authentication authentication) {
        return eventRepository.findWithTailableCursorBy();
    }
}
