package it.polito.ai.pedibus.api.controllers;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;

@CrossOrigin
@RestController
@RequestMapping("/events")
public class NotificationController {
    private Map<String, Consumer<String>> listeners = new ConcurrentHashMap<>();


    @RequestMapping(value = "/write", method = RequestMethod.POST)
    public String writeThing(Authentication authentication, @RequestBody String message) {
        String name = authentication.getName();
        listeners.get(name).accept(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + " ["+name+"] " + message);
        return "Done";
    }

    @GetMapping(value="/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamEvents(Authentication authentication) {
        String name = authentication.getName();
        return Flux.create(sink -> {
            listeners.put(name, sink::next);
        });
    }

    @GetMapping(value="/lol")
    public String getUser(Authentication authentication) {
        return authentication.getName();
    }
}
