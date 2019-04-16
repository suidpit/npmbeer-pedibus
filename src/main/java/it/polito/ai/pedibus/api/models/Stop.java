package it.polito.ai.pedibus.api.models;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

@Data
public class Stop {

    @Id
    private ObjectId id;

    private String name;
    private String time;
    private String position;

    private String line_id;
    private Boolean up_down;
}
