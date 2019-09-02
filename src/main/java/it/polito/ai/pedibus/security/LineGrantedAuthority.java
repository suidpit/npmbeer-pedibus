package it.polito.ai.pedibus.security;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

public class LineGrantedAuthority implements GrantedAuthority {

    private SystemAuthority.Authority authority;

    //TODO: line list
    private List<String> lineNames;

    public LineGrantedAuthority(SystemAuthority.Authority authority, List<String> lineNames) {
        this.authority = authority;
        this.lineNames = lineNames;
    }

    @Override
    public String getAuthority() {
        return this.authority.name();
    }

    public List<String> getLineNames() {
        return this.lineNames;
    }

    @Override
    public String toString() {
        return this.authority.name() + ": " + this.lineNames.toString();
    }
}