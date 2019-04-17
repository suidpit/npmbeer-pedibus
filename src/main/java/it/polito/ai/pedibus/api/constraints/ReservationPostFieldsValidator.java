package it.polito.ai.pedibus.api.constraints;

import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.models.Stop;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.constraintvalidation.SupportedValidationTarget;
import javax.validation.constraintvalidation.ValidationTarget;

@SupportedValidationTarget(ValidationTarget.PARAMETERS)
public class ReservationPostFieldsValidator implements ConstraintValidator<ReservationPostFields, Object[]> {

    @Autowired
    private LinesRepository repo;

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
        if (direction == Reservation.Direction.OUTWARD) {
            if ((line.getOutward().get(tripIndex).stream().noneMatch(s -> s.getName().equals(stopName)))) {
                return false;
            }
        }
        else if ((line.getBack().get(tripIndex).stream().noneMatch(s -> s.getName().equals(stopName)))) {
            return false;
        }
        return true;
    }
}
