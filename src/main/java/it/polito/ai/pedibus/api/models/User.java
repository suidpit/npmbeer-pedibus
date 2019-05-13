package it.polito.ai.pedibus.api.models;

import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.*;

@Data
@Builder
@Document(collection = "users")
public class User {

    @Id
    ObjectId id;
    @Email
    private String email;
    private String password;

}
