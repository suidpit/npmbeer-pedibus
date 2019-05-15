package it.polito.ai.pedibus.api.constraints;

import it.polito.ai.pedibus.api.dtos.NewPasswordDTO;
import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EqualPasswordsValidator implements ConstraintValidator<EqualPasswords, UserDTO> {
    @Override
    public void initialize(EqualPasswords constraint) {
    }

    @Override
    public boolean isValid(UserDTO form, ConstraintValidatorContext ctx) {
        return form.getPass().equals(form.getRepass());
    }

}
