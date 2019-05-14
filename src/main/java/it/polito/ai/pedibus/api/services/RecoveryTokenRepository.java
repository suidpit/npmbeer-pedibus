package it.polito.ai.pedibus.api.services;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecoveryTokenRepository extends MongoRepository<RecoveryToken,String> {

}
