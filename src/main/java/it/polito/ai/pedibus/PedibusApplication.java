package it.polito.ai.pedibus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

@EnableMongoAuditing
@EnableReactiveMongoRepositories
@EnableMongoRepositories
@SpringBootApplication
public class PedibusApplication {

    public static void main(String[] args) {
        SpringApplication.run(PedibusApplication.class, args);
    }
}
