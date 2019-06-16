package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@Builder
public class Child {
    private String name;
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId resId;
}
