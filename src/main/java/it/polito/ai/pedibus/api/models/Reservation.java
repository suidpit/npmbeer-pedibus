package it.polito.ai.pedibus.api.models;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;


@Data
@Builder
@Document(collection = "reservations")
public class Reservation {
    public enum Direction {OUTWARD, BACK}

    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="dd-MM-yyyy")
    private LocalDate date;
    private String lineName;
    // We're not sure an ID is needed here, since every stop name, in the context of a direction and tripIndex number, is unique.
    private String childName;
    private Direction direction;
    private String stopName;
    // This just represents an index in the array of trips for that line, in that direction.
    private Integer tripIndex;
}
