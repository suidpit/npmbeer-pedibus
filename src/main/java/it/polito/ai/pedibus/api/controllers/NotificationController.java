package it.polito.ai.pedibus.api.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

@CrossOrigin
@RestController
@RequestMapping("/events")
public class NotificationController {
    private List<Consumer<String>> listeners = new CopyOnWriteArrayList<>();

    public NotificationController() {

    }

    @RequestMapping(value = "/write", method = RequestMethod.POST)
    public String writeThing(@RequestBody String message) {
        listeners.forEach(c -> c.accept(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + " " + message));
        return "Done";
    }

    @GetMapping(value="/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamEvents() {
        return Flux.create(sink -> {
            listeners.add(sink::next);
        });
    }
}
