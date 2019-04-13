package it.polito.ai.pedibus.api.models;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.Email;
import java.util.List;

@Data
public class Line {
    @Id
    private ObjectId _id;
    private List<Stop> stops;
    @Email
    private String admin_email;
}
