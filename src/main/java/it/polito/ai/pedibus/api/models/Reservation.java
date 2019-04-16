package it.polito.ai.pedibus.api.models;


import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "reservations")
public class Reservation {
    @Id
    private ObjectId id;
    private String res_name;
    private String date;
    private String line_name;
    private String child;

}
