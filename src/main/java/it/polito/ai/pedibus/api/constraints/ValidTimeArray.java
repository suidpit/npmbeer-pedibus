package it.polito.ai.pedibus.api.constraints;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = ValidTimeArrayValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ValidTimeArray {
    String message() default
            "invalid time array.";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
