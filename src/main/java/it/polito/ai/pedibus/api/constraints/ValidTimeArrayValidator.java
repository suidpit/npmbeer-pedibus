package it.polito.ai.pedibus.api.constraints;


import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Stop;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ValidTimeArrayValidator implements ConstraintValidator<ValidTimeArray, Line> {

    @Override
    public void initialize(ValidTimeArray constraint) {
    }

    @Override
    public boolean isValid(Line line, ConstraintValidatorContext ctx) {
        int length_back = line.getStops().get(0).getBack().size();
        int length_out = line.getStops().get(0).getOutward().size();
        return line.getStops().stream().allMatch(stop -> stop.getBack().size() == length_back && stop.getOutward().size() == length_out);
    }
}
