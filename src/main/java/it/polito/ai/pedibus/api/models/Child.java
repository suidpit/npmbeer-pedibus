package it.polito.ai.pedibus.api.models;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import java.time.LocalDate;

@Data
@Document(collection = "children")
public class Child {
   /* @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    ObjectId id;*/


    private String name;

    private String surname;

    private LocalDate birthday;

    private Sex gender;


    enum Sex{
        F,
        M
    }

}
