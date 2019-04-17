package it.polito.ai.pedibus.api.constraints;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = ReservationPutFieldsValidator.class)
@Target({ ElementType.METHOD, ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ReservationPutFields {
    String message() default
            "error.";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
