package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import it.polito.ai.pedibus.security.CustomUserDetailsService;
import lombok.Data;

import java.util.HashMap;
import java.util.List;

@Data
public class UserPrivilegesDTO {

    private SystemAuthority.Authority authority;

    private String lineName;

    private String action;

}
