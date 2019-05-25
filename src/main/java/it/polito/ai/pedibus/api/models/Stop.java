package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import it.polito.ai.pedibus.api.constraints.ValidCoordinate;
import lombok.Data;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;

import java.time.LocalTime;

@Data
public class Stop {

    // It doesn't have an ID right now, since it is bound to its line.
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime time;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2D)
    @ValidCoordinate
    private GeoJsonPoint position;
}
