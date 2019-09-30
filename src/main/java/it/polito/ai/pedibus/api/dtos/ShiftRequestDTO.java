package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.models.Stop;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

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

    private Stop to;

    private boolean open;

}
