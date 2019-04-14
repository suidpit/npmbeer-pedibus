package it.polito.ai.pedibus.api.models;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Data
public class Stop {

    @Id
    private ObjectId _id;
    private Integer line_id;
    private String name;
    private String time;
    private String position;
    private Boolean up_down;
    //Comment
}
