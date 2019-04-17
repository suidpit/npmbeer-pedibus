package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalTime;

@Data
public class Stop {

    // It doesn't have an ID right now, since it is bound to its line.
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime time;
    private String position;
}
