package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import it.polito.ai.pedibus.api.constraints.ValidCoordinate;
import it.polito.ai.pedibus.api.serializers.GeoJsonPointDeserializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalizationMessageDTO {

     @ValidCoordinate
     @JsonDeserialize(using = GeoJsonPointDeserializer.class)
     private GeoJsonPoint position;

     private Timestamp timestamp;
}
