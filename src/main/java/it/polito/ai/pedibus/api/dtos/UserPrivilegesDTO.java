package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import lombok.Data;

import java.util.List;

@Data
public class UserPrivilegesDTO {

    private List<String> roles;

    private List<SystemAuthority> authorities;

}
