package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.constraints.ValidTimeArray;
import it.polito.ai.pedibus.api.utils.ValidList;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Valid;
import javax.validation.constraints.Email;

@Data
@ValidTimeArray
@Document(collection = "lines")
public class Line {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String name;
    @Valid
    private ValidList<Stop> stops;
    @Email
    private String admin_email;
}
