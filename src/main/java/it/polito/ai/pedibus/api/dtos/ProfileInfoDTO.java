package it.polito.ai.pedibus.api.dtos;

import lombok.Data;

@Data
public class ProfileInfoDTO {
    private String email;
    private String name;
    private String surname;
    private String address;
    private String telephone;
}
