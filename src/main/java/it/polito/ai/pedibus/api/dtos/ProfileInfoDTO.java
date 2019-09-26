package it.polito.ai.pedibus.api.dtos;

import lombok.Data;

@Data
public class ProfileInfoDTO {
    private String alt_email;
    private String name;
    private String surname;
    private String address;
    private String telephone;
    private String email;
    private boolean photoFile;
    private String photo;
}
