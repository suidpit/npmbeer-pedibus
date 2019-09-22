package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "unauthorized action on line attempt.")
public class UnauthorizedLineActionException extends RuntimeException {
    public UnauthorizedLineActionException(){
        super();
    }
}
