package it.polito.ai.pedibus.api.exceptions;

public class EmailExistsException extends Exception {
    public EmailExistsException(String errorMessage){
        super(errorMessage);
    }
}
