package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.Reservation;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class ShiftRequestDTO {

    @NotNull
    private LocalDate date;

    @NotNull
    private String lineName;

    @NotNull
    private Reservation.Direction direction;

    @NotNull
    private Integer tripIndex;
}
