package it.polito.ai.pedibus.api.constraints;

import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.LineRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.constraintvalidation.SupportedValidationTarget;
import javax.validation.constraintvalidation.ValidationTarget;

@SupportedValidationTarget(ValidationTarget.PARAMETERS)
public class ReservationPostFieldsValidator implements ConstraintValidator<ReservationPostFields, Object[]> {

    @Autowired
    private LineRepository repo;

    @Override
    public boolean isValid(Object[] value,
                           ConstraintValidatorContext context) {

        // Ensure the line exists in our repository
        String lineName = String.valueOf(value[0]);
        Line line = repo.findByName(lineName);
        if (line == null) {
            return false;
        }
        // Ensure a valid object has been passed
        if (!(value[2] instanceof ReservationDTO)) {
            return false;
        }

        // Ensure that for the given line we have a valid direction/trip/name Stop record.
        ReservationDTO res = (ReservationDTO) value[2];
        String stopName = res.getStopName();
        Integer tripIndex = res.getTripIndex();
        Reservation.Direction direction = res.getDirection();
        if (line.getStops().stream().noneMatch(s -> s.getName().equals(stopName))) {
            return false;
        }

        if (direction == Reservation.Direction.OUTWARD) {
            if (line.getStops().get(0).getOutward().size() <= tripIndex) {
                return false;
            }
        } else if (line.getStops().get(0).getBack().size() <= tripIndex) {
            return false;
        }
        return true;
    }
}
