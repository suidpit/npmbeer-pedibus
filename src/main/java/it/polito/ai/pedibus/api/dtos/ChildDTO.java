package it.polito.ai.pedibus.api.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mongodb.lang.Nullable;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.Photo;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.time.LocalDate;
import java.util.Optional;

@Data
public class ChildDTO {

    @Nullable
    private String id;
    @NotNull
    private String name;

    @NotNull
    private String surname;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern="dd-MM-yyyy")
    @NotNull
    private LocalDate birthday;

    @NotNull
    private boolean disability;

    @NotNull
    private Child.Sex gender;

    @Nullable
    private String other;

    @Nullable
    private String photo;

    private boolean photoFile;

    public void of(Child child, String photo){
        setBirthday(child.getBirthday());
        setDisability(child.isDisability());
        setGender(child.getGender());
        setName(child.getName());
        setOther(child.getOther());
        setSurname(child.getSurname());
        setId(child.getId().toString());
        if(photo!=null){
            setPhotoFile(true);
            setPhoto("data:image/JPG;base64,"+photo);
        }
    }

}
