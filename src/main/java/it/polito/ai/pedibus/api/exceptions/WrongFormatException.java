package it.polito.ai.pedibus.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "wrong information format or missing information")
public class WrongFormatException extends RuntimeException {
    public WrongFormatException(){
        super();
    }
}
