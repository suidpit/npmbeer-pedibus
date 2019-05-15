package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.constraints.EqualPasswords;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Data
public class NewPasswordDTO {

    @NotNull
    @Size.List({
            @Size(min = 8,
                    message = "{registration.password.min.message}"),
            @Size(max = 32,
                    message = "{registration.password.max.message}")
    })
    private String pass;

    @NotNull
    @Size.List({
            @Size(min = 8,
                    message = "{registration.password.min.message}"),
            @Size(max = 32,
                    message = "{registration.password.max.message}")
    })
    private String repass;
}
