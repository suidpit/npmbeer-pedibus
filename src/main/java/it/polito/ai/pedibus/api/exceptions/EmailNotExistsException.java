package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "email not exist yet")
public class EmailNotExistsException extends RuntimeException {
    public EmailNotExistsException(){
        super();
    }
}
