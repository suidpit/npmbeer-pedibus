package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Too Many Children")
public class TooManyChildrenException extends RuntimeException {
    public TooManyChildrenException(){super();}
}
