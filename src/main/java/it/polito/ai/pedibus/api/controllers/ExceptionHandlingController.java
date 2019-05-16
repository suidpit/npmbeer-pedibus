package it.polito.ai.pedibus.api.controllers;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestControllerAdvice
public class ExceptionHandlingController {

    @ExceptionHandler(HttpClientErrorException.class)
    public void handleHttpClientException(HttpServletResponse res, HttpClientErrorException ex) throws IOException{
        res.sendError(ex.getStatusCode().value(), ex.getStatusText());
    }
}
