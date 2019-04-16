package it.polito.ai.pedibus.api.constraints;

import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.constraintvalidation.SupportedValidationTarget;
import javax.validation.constraintvalidation.ValidationTarget;

@SupportedValidationTarget(ValidationTarget.PARAMETERS)
public class ReservationPutFieldsValidator implements ConstraintValidator<ReservationPutFields, Object[]> {

    @Autowired
    private ReservationRepository repo;

    @Override
    public boolean isValid(Object[] value,
                           ConstraintValidatorContext context) {
        // For now, the only logic we want is to have a valid ID in reservation, and that id has to match line and date.
        String lineName = String.valueOf(value[0]);
        String date = String.valueOf(value[1]);
        ObjectId id = (ObjectId) value[2];
        Reservation res = repo.findByLineNameAndDateAndId(lineName, date, id);
        return res != null;
    }
}
