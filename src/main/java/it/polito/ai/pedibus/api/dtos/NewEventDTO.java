package it.polito.ai.pedibus.api.dtos;

import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;

import javax.validation.constraints.NotNull;

@Data
@Builder
public class NewEventDTO {
    @NotNull
    private String type;
    @NotNull
    private String body;
    @NotNull
    private ObjectId userId;

    private ObjectId objectReferenceId;

    private Boolean read;
}
