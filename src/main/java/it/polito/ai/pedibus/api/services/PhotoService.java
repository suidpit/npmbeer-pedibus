package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.Photo;
import it.polito.ai.pedibus.api.repositories.PhotoRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
public class PhotoService {

    private final PhotoRepository photoRepo;

    private final Path rootLocation = Paths.get(System.getProperty("user.dir")).resolve("upload-dir");

    @Autowired
    public PhotoService(PhotoRepository photoRepo) {
        this.photoRepo = photoRepo;
    }

    public ObjectId store(MultipartFile file, ObjectId id) {
        ObjectId photoId;
        if (photoRepo.getByOwner(id) != null) {
            photoId = photoRepo.getByOwner(id).getId();
        } else {
            Photo photo = new Photo();
            photo.setOwner(id);
            photoId = photoRepo.insert(photo).getId();
        }
        try {
            Files.copy(file.getInputStream(), this.rootLocation.resolve(photoId.toString()), REPLACE_EXISTING);
            return photoId;
        } catch (Exception e) {
            throw new RuntimeException("FAIL! "+ e.getMessage());
        }
    }

    String loadPhoto(ObjectId owner) throws Exception {
        File file = new File(rootLocation.resolve(photoRepo.getByOwner(owner).getId().toString()).toString());
        return Base64.getEncoder().withoutPadding().encodeToString(Files.readAllBytes(file.toPath()));
    }

    public void init() {
        try {
            Files.deleteIfExists(rootLocation);
            Files.createDirectory(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage!");
        }
    }

    public void deletePhoto(ObjectId id){
        try {
            Files.deleteIfExists(this.rootLocation.resolve(id.toString()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete photo");
        }
    }
}

