package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;

@Data
@Builder
@Document(collection = "events")
public class Event {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    // Could be an ENUM
    private String type;
    private String body;
    private Boolean read;
    private Timestamp created_at;
    private ObjectId userId;
}
