package it.polito.ai.pedibus.api.models;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.GeoJsonPointDeserializer;
import it.polito.ai.pedibus.api.serializers.ObjectIdListSerializer;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Data
@Document(collection = "shifts")
public class Shift implements Cloneable{

    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="dd-MM-yyyy")
    private LocalDate date;
    private String lineName;
    // We're not sure an ID is needed here, since every stop name, in the context of a direction and tripIndex number, is unique.
    private Reservation.Direction direction;
    // This just represents an index in the array of trips for that line, in that direction.
    private Integer tripIndex;

    @Valid
    @Indexed()
    private String from;
    @Valid
    private String to;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="HH:mm")
    private LocalTime startsAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="HH:mm")
    private LocalTime endsAt;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId companionId;

    @JsonSerialize(using = ObjectIdListSerializer.class)
    private List<ObjectId> availabilities;

    @Email
    private String defaultCompanion;

    private boolean open;

    @JsonDeserialize(using=GeoJsonPointDeserializer.class)
    private GeoJsonPoint lastUpdate;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
