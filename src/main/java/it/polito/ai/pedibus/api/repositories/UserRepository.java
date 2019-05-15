package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String> {
    User findByEmail(String email);

    boolean existsByEmail();

    boolean existsByEmail(String email);

    User getByEmail(String email);
}
