package it.polito.ai.pedibus.api.utils;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Convertion {

    public static HashMap<String, List<String>> authoritiesToMap(List<SystemAuthority> authorities){
        HashMap<String, List<String>> authorityMap = new HashMap<>();

        for(SystemAuthority sa: authorities){
            authorityMap.put(sa.getAuthority().name(), sa.getLine_names());
        }

        return authorityMap;
    }
}
