package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.models.Stop;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class ShiftResponseDTO {

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId shiftId;

    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate date;

    private String lineName;

    private Reservation.Direction direction;

    private GeoJsonPoint latestUpdate;

    private Stop from;

    private Stop to;

}
