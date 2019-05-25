package it.polito.ai.pedibus.api.constraints;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ValidCoordinateValidator implements ConstraintValidator<ValidCoordinate, GeoJsonPoint> {

    @Override
    public void initialize(ValidCoordinate constraint) {
    }

    @Override
    public boolean isValid(GeoJsonPoint gjp, ConstraintValidatorContext ctx) {
        if(gjp.getX()>180 || gjp.getY()>90 || gjp.getX()<-180 || gjp.getY()<-90) {
            return false;
        }
        else {
            return true;
        }
    }
}