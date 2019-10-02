package it.polito.ai.pedibus.api.models;

import lombok.Data;
import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;

@Document(collection = "photos")
@Data
public class Photo {
    @Id
    private ObjectId id;

    @NotNull
    private ObjectId owner;
}
