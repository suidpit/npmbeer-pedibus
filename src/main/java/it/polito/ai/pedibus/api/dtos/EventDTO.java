package it.polito.ai.pedibus.api.dtos;

import javax.validation.constraints.NotNull;


public class EventDTO {
    @NotNull
    private String type;
    @NotNull
    private String body;
    @NotNull
    private String created_at;
    @NotNull
    private Boolean read;
}
