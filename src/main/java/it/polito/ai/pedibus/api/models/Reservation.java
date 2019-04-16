package it.polito.ai.pedibus.api.models;


import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@Document(collection = "reservations")
public class Reservation {
    public enum Direction {OUTWARD, BACK};

    @Id
    private ObjectId id;
    private String date;
    private String lineName;
    // We're not sure an ID is needed here, since every stop name, in the context of a direction and tripIndex number, is unique.
    private String stopName;
    private String childName;
    private Direction direction;
    // This just represents an index in the array of trips for that line, in that direction.
    private Integer tripIndex;
}
