package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "specified user does not exist.")
public class NoSuchUserException extends RuntimeException {
    public NoSuchUserException(){
        super();
    }
}
