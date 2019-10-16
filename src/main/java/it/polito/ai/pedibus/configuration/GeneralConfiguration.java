package it.polito.ai.pedibus.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.CreateCollectionOptions;
import it.polito.ai.pedibus.api.dtos.NewEventDTO;
import it.polito.ai.pedibus.api.models.*;
import it.polito.ai.pedibus.api.repositories.*;
import it.polito.ai.pedibus.api.services.EventService;
import it.polito.ai.pedibus.api.services.PhotoService;
import it.polito.ai.pedibus.api.services.UserService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.CollectionOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonModule;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Configuration
public class GeneralConfiguration {


    Logger logger = LoggerFactory.getLogger(GeneralConfiguration.class);
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
                                     MongoTemplate mongoTemplate,
                                     EventRepository eventRepository)
            throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.registerModule(new GeoJsonModule());
        logger.info("Inside general configuration");


        MongoClient mc = new MongoClient("localhost", 27017);
        MongoDatabase collections = mc.getDatabase("test");
        boolean checkR = true;
        boolean checkP = true;
        boolean checkE = true;
        for (String name : collections.listCollectionNames()) {
            if (name.equals("reservations")) {
                checkR = false;
            }
            if (name.equals("photos")) {
                checkP = false;
            }
            if (name.equals("events")) {
                checkE = false;
            }
        }
        if (checkR) {
            collections.createCollection("reservations");
        }
        if (checkP) {
            collections.createCollection("photos");
            photoService.init();
        }
        if (checkE) {
            CreateCollectionOptions options = new CreateCollectionOptions().capped(true).sizeInBytes(5242880).maxDocuments(5000);
            collections.createCollection("events", options);
        }

        // Read lines from .json using the mapper (second argument returns a TypeReference to List<Line> type
        List<Line> lines = mapper.readValue(new File(initDataFileName),
                mapper.getTypeFactory().constructCollectionType(List.class, Line.class));
        // Automatically inserting all the lines data only if it has not been already initialized.
        if (lineRepository.findAll().size() == 0) {
            lineRepository.insert(lines);
        }

        logger.info("Before user init");
        // Inserting all the user and child data only if user has not been already initialized.
        if (userRepository.findAll().size() == 0) {
            childRepository.deleteAll();

            List<UserTemp> tempUsers = mapper.readValue(new File(userInitDataFileName),
                    mapper.getTypeFactory().constructCollectionType(List.class, UserTemp.class));
            ArrayList<Event> events = new ArrayList<>();
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
                logger.info(u.toString());
                User user = userRepository.save(u);

                Event e = Event.builder()
                        .body("Benvenuto su Pedibus!")
                        .type("Welcome")
                        .userId(user.getId())
                        .read(false)
                        .created_at(new Timestamp(new Date().getTime()))
                        .objectReferenceId(null)
                        .build();
                eventRepository.save(e).subscribe();
            }

        }


//
//        List<Shift> shifts = mapper.readValue(new File(shiftsInitDataFileName),
//                mapper.getTypeFactory().constructCollectionType(List.class, Shift.class));
//
//        if(shiftRepository.findAll().size() == 0){
//            shiftRepository.insert(shifts);
//        }

        return mapper;
    }

}
