package it.polito.ai.pedibus.api.exceptions;

public class EmailExistsException extends RuntimeException {
    public EmailExistsException(String errorMessage){
        super(errorMessage);
    }
}
