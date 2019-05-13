package it.polito.ai.pedibus.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Configuration
public class GeneralConfiguration {

    private static String initDataFileName = "init.json";

    @Bean
    @Autowired
    public ObjectMapper objectMapper(LinesRepository linesRepository) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        // Read lines from .json using the mapper (second argument returns a TypeReference to List<Line> type
        List<Line> lines = mapper.readValue(new File(initDataFileName),
                mapper.getTypeFactory().constructCollectionType(List.class, Line.class));

        // Automagically inserting all the lines data only if it has not been already initialized.
        if (linesRepository.findAll().size() == 0) {
            linesRepository.insert(lines);
        }
        return mapper;
    }

    @Bean
    public DateTimeFormatter fmt(){
        return DateTimeFormatter.ofPattern("ddMMyyyy");
    }

}