package it.polito.ai.pedibus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@SpringBootApplication
public class PedibusApplication {

    public static void main(String[] args) {
        SpringApplication.run(PedibusApplication.class, args);
    }
}
