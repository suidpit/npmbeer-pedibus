package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Child;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.lang.management.BufferPoolMXBean;
import java.util.List;

public interface ChildRepository extends MongoRepository<Child,String> {

    Child getById(ObjectId id);
}
