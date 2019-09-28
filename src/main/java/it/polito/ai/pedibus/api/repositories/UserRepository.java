package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User,String> {
    User findByEmail(String email);

    List<User> findAll();

    boolean existsByEmail();

    boolean existsByEmail(String email);

    User getByEmail(String email);

    User getById(ObjectId id);
}
