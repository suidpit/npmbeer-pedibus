package it.polito.ai.pedibus.api.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SystemAuthority {

    private String lineName;
    private Authority authority;

    public enum Authority {SYSTEM_ADMIN, ADMIN, USER}
}
