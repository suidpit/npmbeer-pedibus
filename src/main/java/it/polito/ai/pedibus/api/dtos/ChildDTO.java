package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.Child;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class ChildDTO {

    @Email
    private String email;

    @NotNull
    private String name;

    @NotNull
    private String surname;

    @NotNull
    private String birthday;

    @NotNull
    private String gender;



}
