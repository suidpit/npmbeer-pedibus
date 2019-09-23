package it.polito.ai.pedibus.api.models;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.serializers.ObjectIdListSerializer;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import java.time.LocalDate;
import java.util.List;


@Data
@Document(collection = "shifts")
public class Shift implements Cloneable{
    public enum Direction {OUTWARD, BACK}

    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="dd-MM-yyyy")
    private LocalDate date;
    private String lineName;
    // We're not sure an ID is needed here, since every stop name, in the context of a direction and tripIndex number, is unique.
    private Direction direction;
    // This just represents an index in the array of trips for that line, in that direction.
    private Integer tripIndex;

    @Valid
    @Indexed()
    private Stop from;
    @Valid
    private Stop to;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId companionId;

    @JsonSerialize(using = ObjectIdListSerializer.class)
    private List<ObjectId> availabilities;

    @Email
    private String defaultCompanion;

    private boolean open;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
