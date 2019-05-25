package it.polito.ai.pedibus.api.constraints;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = ValidCoordinateValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ValidCoordinate {
    String message() default
            "invalid coordinate.";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
