package it.polito.ai.pedibus.api.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.bson.types.ObjectId;

import java.io.IOException;
import java.util.List;

public class ObjectIdListSerializer extends JsonSerializer<Object> {
    @Override
    public void serialize(Object value, JsonGenerator jsonGen, SerializerProvider provider) throws IOException {
     try{
         List<ObjectId> ids = (List<ObjectId>) value;
         jsonGen.writeStartArray();
         for(ObjectId id: ids){
             jsonGen.writeString(id.toString());
         }
         jsonGen.writeEndArray();
        }
        catch (Exception e){
         throw new IOException("Cannot deserialize into List<ObjectId>");
        }
    }
}