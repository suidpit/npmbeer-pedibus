package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.Reservation;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ReservationDTO {
    // TODO: Set constraints
    @NotNull
    private String stopName;
    @NotNull
    private String child;
    @NotNull
    private Reservation.Direction direction;
    @NotNull
    private Integer tripIndex;
    private Boolean booked;
    private Boolean present;
}
