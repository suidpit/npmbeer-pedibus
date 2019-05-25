package it.polito.ai.pedibus.api.services;

public class EmailExistsException extends Exception {
    public EmailExistsException(String errorMessage){
        super(errorMessage);
    }
}
