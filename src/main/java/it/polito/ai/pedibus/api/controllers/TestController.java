package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.models.Event;
import it.polito.ai.pedibus.api.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.sql.Timestamp;
import java.util.Date;

@CrossOrigin
@RestController
@RequestMapping("test")
public class TestController {
    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/events")
    public Mono<Event> testEventSave(@RequestBody String body) {
        Event ev = Event.builder()
                .body(body)
                .read(false)
                .type("Test")
                .created_at(new Timestamp(new Date().getTime()))
                .build();
        return eventRepository.save(ev);
    }
}
