package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "email exist already")
public class EmailExistsException extends RuntimeException {
    public EmailExistsException(){
        super();
    }
}
