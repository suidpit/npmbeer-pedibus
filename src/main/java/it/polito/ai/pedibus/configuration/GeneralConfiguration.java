package it.polito.ai.pedibus.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import it.polito.ai.pedibus.api.models.*;
import it.polito.ai.pedibus.api.repositories.*;
import it.polito.ai.pedibus.api.services.PhotoService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonModule;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class GeneralConfiguration {

    @Autowired
    PasswordEncoder encoder;

    private static String initDataFileName = "init.json";
    private static String userInitDataFileName = "user_init.json";
    private static String shiftsInitDataFileName = "shifts.json";

    @Bean
    public DateTimeFormatter fmt() {
        return DateTimeFormatter.ofPattern("ddMMyyyy");
    }

    @Bean
    @Autowired
    public ObjectMapper objectMapper(LineRepository lineRepository,
                                     UserRepository userRepository,
                                     ShiftRepository shiftRepository,
                                     ChildRepository childRepository,
                                     PhotoService photoService,
                                     MongoTemplate mongoTemplate)
            throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.registerModule(new GeoJsonModule());

        // Read lines from .json using the mapper (second argument returns a TypeReference to List<Line> type
        List<Line> lines = mapper.readValue(new File(initDataFileName),
                mapper.getTypeFactory().constructCollectionType(List.class, Line.class));

        // Automatically inserting all the lines data only if it has not been already initialized.
        if (lineRepository.findAll().size() == 0) {
            lineRepository.insert(lines);
        }


        // Inserting all the user and child data only if user has not been already initialized.
        if (userRepository.findAll().size() == 0) {
            childRepository.deleteAll();

            List<UserTemp> tempUsers = mapper.readValue(new File(userInitDataFileName),
                    mapper.getTypeFactory().constructCollectionType(List.class, UserTemp.class));

            for(UserTemp o : tempUsers){
                User u = new User();
                u.setPassword(encoder.encode(o.getPassword()));
                u.setEnabled(o.isEnabled());
                u.setAuthorities(o.getAuthorities());
                u.setEmail(o.getEmail());
                u.setRoles(o.getRoles());
                u.setAddress(o.getAddress());
                u.setName(o.getName());
                u.setSurname(o.getSurname());
                u.setTelNumber(o.getTelNumber());
                List<ObjectId> ids = new ArrayList<>();
                for(Child c : childRepository.insert(o.getChildren())){
                    ids.add(c.getId());
                }
                u.setChildren(ids);
                userRepository.insert(u);
            }
        }


//
//        List<Shift> shifts = mapper.readValue(new File(shiftsInitDataFileName),
//                mapper.getTypeFactory().constructCollectionType(List.class, Shift.class));
//
//        if(shiftRepository.findAll().size() == 0){
//            shiftRepository.insert(shifts);
//        }


        MongoClient mc = new MongoClient("127.0.0.1", 27017);
        MongoDatabase collections = mc.getDatabase("test");
        boolean checkR = true;
        boolean checkP = true;
        for (String name : collections.listCollectionNames()) {
            if (name.equals("reservations")) {
                checkR = false;
            }
            if (name.equals("photos")) {
                checkP = false;
            }
        }
        if (checkR) {
            collections.createCollection("reservations");
        }
        if (checkP) {
            collections.createCollection("photos");
            photoService.init();
        }
        return mapper;
    }

}
