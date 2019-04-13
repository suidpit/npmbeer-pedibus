package it.polito.ai.pedibus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.mongobee.Mongobee;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class PedibusApplication {

    private static String testDataFileName = "test_data_init.json";
    private static String rootDir;
    private static Logger logger = LoggerFactory.getLogger(PedibusApplication.class);

    @Bean
    @Autowired
    public ObjectMapper objectMapper(LinesRepository linesRepository) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        // Construct path to test data init file
        String pathToTest = rootDir+"\\"+testDataFileName;

        // Read lines from .json using the mapper (second argument returns a TypeReference to List<Line> type
        List<Line> lines = mapper.readValue(new File(pathToTest),
                mapper.getTypeFactory().constructCollectionType(List.class, Line.class));

        for(Line l : lines){
            logger.info(l.toString());
        }
        // Automagically inserting all the lines data
        linesRepository.insert(lines);
        return mapper;
    }


    public static void main(String[] args) {
        PedibusApplication.rootDir = System.getProperty("user.dir");
        SpringApplication.run(PedibusApplication.class, args);
    }

    public static String getRootDir(){ return PedibusApplication.rootDir; }
    public static String getTestDataFileName() { return testDataFileName; }
}
