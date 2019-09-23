package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_ACCEPTABLE, reason = "operation not allowed.")
public class DeniedOperationException extends RuntimeException {
    public DeniedOperationException(){
        super();
    }
}
