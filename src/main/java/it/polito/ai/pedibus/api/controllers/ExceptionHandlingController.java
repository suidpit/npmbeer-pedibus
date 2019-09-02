package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.exceptions.EmailExistsException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.format.DateTimeParseException;

@RestControllerAdvice
public class ExceptionHandlingController extends ResponseEntityExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public void handleHttpClientException(HttpServletResponse res, HttpClientErrorException ex) throws IOException{
        res.sendError(ex.getStatusCode().value(), ex.getStatusText());
    }

    @ExceptionHandler(value = {EmailExistsException.class})
    protected ResponseEntity<Object> handleEmailExistsException(RuntimeException ex,
                                                                WebRequest request) throws  IOException{
        String bodyOfResponse = ex.getMessage();
        return handleExceptionInternal(ex, bodyOfResponse,
                new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(value = {DateTimeParseException.class})
    protected ResponseEntity<Object> handleDateTimeParseException(RuntimeException ex,
                                                                WebRequest request) throws IOException{
        String bodyOfResponse = "Bad Request. Date string format should be ddMMyyyy";
        return handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }
}
