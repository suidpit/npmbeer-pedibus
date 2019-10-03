package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import it.polito.ai.pedibus.security.CustomUserDetailsService;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;

@Data
public class UserPrivilegesDTO {

    @NotNull
    private SystemAuthority.Authority authority;

    @NotNull
    private String lineName;

    @NotNull
    private String action;

}
