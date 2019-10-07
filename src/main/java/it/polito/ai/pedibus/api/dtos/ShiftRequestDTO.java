package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mongodb.lang.Nullable;
import it.polito.ai.pedibus.api.constraints.ValidCoordinate;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.models.Stop;
import it.polito.ai.pedibus.api.serializers.GeoJsonPointDeserializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ShiftRequestDTO {

    // can be null
    private ObjectId shiftId;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull
    private String lineName;

    @NotNull
    private Reservation.Direction direction;

    @NotNull
    private Integer tripIndex;

    private String assignedCompanionEmail;

    @Nullable
    private String to;

    @Nullable
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endsAt;

    private boolean open;

    @Nullable
    @JsonDeserialize(using = GeoJsonPointDeserializer.class)
    private GeoJsonPoint position;
}
