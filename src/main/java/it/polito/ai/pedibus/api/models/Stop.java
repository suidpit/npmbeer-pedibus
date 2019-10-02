package it.polito.ai.pedibus.api.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import it.polito.ai.pedibus.api.constraints.ValidCoordinate;
import it.polito.ai.pedibus.api.serializers.GeoJsonPointDeserializer;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.geo.GeoJsonModule;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;

import javax.validation.constraints.NotNull;
import java.beans.Transient;
import java.time.LocalTime;

@Data
@EqualsAndHashCode
public class Stop {

    // It doesn't have an ID right now, since it is bound to its line.
    @NotNull
    private String name;

    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime time;

    @JsonDeserialize(using=GeoJsonPointDeserializer.class)
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    @ValidCoordinate
    private GeoJsonPoint position;

    @Transient
    public boolean hasNullFields(){
        return this.name == null || this.time == null || this.position == null;
    }

}
