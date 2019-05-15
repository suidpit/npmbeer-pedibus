package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.constraints.EqualPasswords;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Data
@EqualPasswords
public class UserDTO {
    @Email(message = "{registration.email.wrongformat.message}")
    @NotEmpty(message = "{registration.email.min.message}")
    @Size(max = 255,
            message = "{registration.nome.max.message}")
    private String email;

    @Size.List({
            @Size(min = 8,
                    message = "{registration.password.min.message}"),
            @Size(max = 32,
                    message = "{registration.password.max.message}")
    })
    private String pass;

    @Size.List({
            @Size(min = 8,
                    message = "{registration.password.min.message}"),
            @Size(max = 32,
                    message = "{registration.password.max.message}")
    })
    private String repass;
}
