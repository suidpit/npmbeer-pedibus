package it.polito.ai.pedibus.api.models;

import lombok.Data;
import lombok.Value;

@Data
public class Stop {

    // It doesn't have an ID right now, since it is bound to its line.
    private String name;
    private String time;
    private String position;

}
