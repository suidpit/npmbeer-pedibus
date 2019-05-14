package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmailVerificationTokenRepository extends MongoRepository<ModelEmailVerificationToken,String> {
    ModelEmailVerificationToken findByToken(String token);

    ModelEmailVerificationToken findByUser(User user);
}
