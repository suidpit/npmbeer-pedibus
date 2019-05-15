package it.polito.ai.pedibus.api.constraints;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = EqualPasswordsValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface EqualPasswords {
    String message() default "{registration.passwords.not_equal.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
