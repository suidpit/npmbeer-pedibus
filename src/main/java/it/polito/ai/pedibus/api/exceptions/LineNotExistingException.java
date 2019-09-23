package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "specified line name does not exist")
public class LineNotExistingException extends RuntimeException {
    public LineNotExistingException(){
        super();
    }
}
