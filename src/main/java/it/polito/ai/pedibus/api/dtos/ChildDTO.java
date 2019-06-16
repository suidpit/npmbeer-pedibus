package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@Builder
public class ChildDTO {
    private String name;
    private Boolean present;
    private Boolean booked;
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId resId;
}
