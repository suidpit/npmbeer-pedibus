package it.polito.ai.pedibus.api.utils;

import it.polito.ai.pedibus.api.models.Child;
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

    @Deprecated
    public static List<HashMap<String, String>> childrenToMap(List<Child> children) {
        if (children != null) {
            List<HashMap<String, String>> childrenList = new ArrayList<>();

            for (Child c : children) {
                HashMap<String, String> fields = new HashMap<>();

                fields.put("name", c.getName());
                fields.put("surname", c.getSurname());
                fields.put("birthday", c.getBirthday().toString());
                fields.put("gender", c.getGender().name());

                childrenList.add(fields);
            }

            return childrenList;
        }
        return null;
    }
}
