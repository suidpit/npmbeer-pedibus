package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmailVerificationTokenRepository extends MongoRepository<EmailVerificationToken,String> {
    EmailVerificationToken findByToken(String token);

    EmailVerificationToken findByUser(User user);
    EmailVerificationToken getByUser(User user);

}
