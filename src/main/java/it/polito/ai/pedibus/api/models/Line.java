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

    private String line_name;
    private List<List<Stop>> goings;    // See below
    private List<List<Stop>> returns;   // Sorry for the plural, but return is a reserved word
    @Email
    private String admin_email;
}
