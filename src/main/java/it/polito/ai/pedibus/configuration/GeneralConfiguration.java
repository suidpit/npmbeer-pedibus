package it.polito.ai.pedibus.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.LineRepository;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonModule;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
@Configuration
public class GeneralConfiguration {

    @Autowired
    PasswordEncoder encoder;

    private static String initDataFileName = "init.json";
    private static String userInitDataFileName = "user_init.json";
    private static String shiftsInitDataFileName = "shifts.json";

    @Bean
    public DateTimeFormatter fmt(){
        return DateTimeFormatter.ofPattern("ddMMyyyy");
    }

    @Bean
    @Autowired
    public ObjectMapper objectMapper(LineRepository lineRepository,
                                     UserRepository userRepository,
                                     ShiftRepository shiftRepository,
                                     MongoTemplate mongoTemplate)
            throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.registerModule(new GeoJsonModule());

        // Read lines from .json using the mapper (second argument returns a TypeReference to List<Line> type
        List<Line> lines = mapper.readValue(new File(initDataFileName),
                mapper.getTypeFactory().constructCollectionType(List.class, Line.class));

        // Automagically inserting all the lines data only if it has not been already initialized.
        if (lineRepository.findAll().size() == 0) {
            lineRepository.insert(lines);
        }

        List<User> users = mapper.readValue(new File(userInitDataFileName),
                            mapper.getTypeFactory().constructCollectionType(List.class, User.class));

        for(User user: users){
            user.setPassword(encoder.encode(user.getPassword()));
        }
        if(userRepository.findAll().size() == 0){
            userRepository.insert(users);
        }
//
//        List<Shift> shifts = mapper.readValue(new File(shiftsInitDataFileName),
//                mapper.getTypeFactory().constructCollectionType(List.class, Shift.class));
//
//        if(shiftRepository.findAll().size() == 0){
//            shiftRepository.insert(shifts);
//        }


        // Remove automatically created indexes on shifts collection, which were causing problems with later insertions
        // mongoTemplate.indexOps("shifts").dropAllIndexes();
        return mapper;
    }

}
