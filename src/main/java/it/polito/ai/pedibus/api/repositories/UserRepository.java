package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User,String> {
    User findByEmail(String email);

    List<User> findAll();

    boolean existsByEmail();

    boolean existsByEmail(String email);

    User getByEmail(String email);
}
