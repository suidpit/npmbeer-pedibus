package it.polito.ai.pedibus.api.dtos;

import lombok.Data;

@Data
public class LoginDTO {
    private String email;
    private String password;
}
