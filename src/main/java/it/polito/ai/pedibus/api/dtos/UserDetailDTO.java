package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.HashMap;
import java.util.List;

@Data
@Builder
public class UserDetailDTO {

    @JsonSerialize(using = ObjectIdSerializer.class)
    ObjectId id;

    private String email;

    private List<ObjectId> children;

    private boolean enabled;

    public static UserDetailDTO of(User u){
        return UserDetailDTO.builder()
                .id(u.getId())
                .email(u.getEmail())
                .children(u.getChildren())
                .enabled(u.isEnabled())
                .build();
    }
}
