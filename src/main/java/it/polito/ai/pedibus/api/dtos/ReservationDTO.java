package it.polito.ai.pedibus.api.dtos;

import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.Reservation;
import lombok.Data;
import org.bson.types.ObjectId;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
public class ReservationDTO {
    // TODO: Set constraints
    @NotNull
    private String stopName;
    @NotNull
    private List<ObjectId> child;
    @NotNull
    private Reservation.Direction direction;
    @NotNull
    private Integer tripIndex;
}
