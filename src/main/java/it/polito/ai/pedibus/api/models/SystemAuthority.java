package it.polito.ai.pedibus.api.models;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
public class SystemAuthority {

    @Field("line_names")
    private List<String> line_names;
    private Authority authority;

    public enum Authority {SYSTEM_ADMIN, ADMIN, USER}

    @Override
    public String toString(){
        StringBuilder sb = new StringBuilder("Auth: ")
                .append(this.authority.name())
                .append(" on lines: ")
                .append(this.line_names.toString());
        return sb.toString();
    }
}
