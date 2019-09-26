package it.polito.ai.pedibus.api.models;

import com.mongodb.lang.Nullable;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import java.util.List;

@Data
@Document(collection = "users")
public class UserTemp {

    @Email
    private String email;

    @Nullable
    private String password;

    private List<String> roles;

    private List<SystemAuthority> authorities;

    private List<Child> children;

    private boolean enabled;

    @Nullable
    private String name;
    @Nullable
    private String surname;
    @Nullable
    private String address;
    @Nullable
    private String telNumber;

}
