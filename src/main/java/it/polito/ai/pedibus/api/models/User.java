package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.*;
import java.util.List;

    @Data
    @Document(collection = "users")
    public class User {

        @Id
        @JsonSerialize(using = ObjectIdSerializer.class)
        ObjectId id;
        @Email
    private String email;
    private String password;

    private List<String> roles;

    private List<SystemAuthority> authorities;

    private boolean enabled;

}
