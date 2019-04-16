package it.polito.ai.pedibus.api.models;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import java.util.List;

@Data
@Document(collection = "lines")
public class Line {
    @Id
    private ObjectId id;
    private String name;
    private List<List<Stop>> outward;
    private List<List<Stop>> back;
    @Email
    private String admin_email;
}
