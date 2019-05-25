package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.RecoveryToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecoveryTokenRepository extends MongoRepository<RecoveryToken,String> {

    RecoveryToken findByToken(String recoveryToken);
}
