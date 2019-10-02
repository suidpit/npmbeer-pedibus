package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.NewEventDTO;
import it.polito.ai.pedibus.api.models.Event;
import it.polito.ai.pedibus.api.services.EventService;
import it.polito.ai.pedibus.security.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.validation.constraints.NotNull;

@CrossOrigin
@RestController
@RequestMapping("/events")
public class EventController {
    private EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value="/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Event> streamEvents(@NotNull Authentication authentication) {
        CustomUserDetails cud = (CustomUserDetails) authentication.getPrincipal();
        ObjectId uid = cud.getId();

        return eventService.getEventsForUser(uid);
    }

    // This method is just for testing!
    // To easily generate events for the user by just
    // visiting the URL...
    @GetMapping(value="/self/write/{type}/{body}")
    public Mono<Event> selfWriteEvent(@PathVariable("type") String type,
                                      @PathVariable("body") String body) {
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal()).
                getId();

        NewEventDTO ne = NewEventDTO.builder()
                .body(body)
                .type(type)
                .userId(userId)
                .build();
        return eventService.pushNewEvent(ne);
    }
}
