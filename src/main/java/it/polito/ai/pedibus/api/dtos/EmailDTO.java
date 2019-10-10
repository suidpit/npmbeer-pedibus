package it.polito.ai.pedibus.api.dtos;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Data
public class EmailDTO {

    @Email(message = "{registration.email.wrongformat.message}")
    @NotEmpty(message = "{registration.email.min.message}")
    @Size(max = 255,
            message = "{registration.nome.max.message}")
    private String email;

    private boolean checkboxCompanion;
}
