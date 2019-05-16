package it.polito.ai.pedibus.api.models;

import lombok.Data;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class SystemAuthority {

    @Field("line_name")
    private String line_name;
    private Authority authority;

    public enum Authority {SYSTEM_ADMIN, ADMIN, USER}
}
