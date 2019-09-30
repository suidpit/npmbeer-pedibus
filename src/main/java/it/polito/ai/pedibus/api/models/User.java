package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.mongodb.lang.Nullable;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.*;
import java.util.HashMap;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    ObjectId id;

    @Email
    private String email;

    @Nullable
    private String password;

    private List<String> roles;

    private List<SystemAuthority> authorities;

    private List<ObjectId> children;

    private boolean enabled;

    @Nullable
    private String name;
    @Nullable
    private String surname;
    @Nullable
    private String address;
    @Nullable
    private String telNumber;
    @Nullable
    @Email
    private String altEmail;
    
    private boolean photo;

    @Nullable
    private String defaultLine;

    @Nullable
    private String defaultStop;
}
