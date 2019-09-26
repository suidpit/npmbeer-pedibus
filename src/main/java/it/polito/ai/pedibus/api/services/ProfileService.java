package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.ChangePasswordDTO;
import it.polito.ai.pedibus.api.dtos.ChildDTO;
import it.polito.ai.pedibus.api.dtos.ProfileInfoDTO;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.ChildRepository;
import it.polito.ai.pedibus.api.repositories.PhotoRepository;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.security.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;
import sun.security.util.Password;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {
    private UserRepository userRepository;
    private ChildRepository childRepository;
    private PhotoService photoService;
    private PhotoRepository photoRepository;
    private ReservationRepository reservationsRepository;

    public ProfileService(UserRepository userRepository, ChildRepository childRepository, PhotoService photoService, PhotoService photoRepository, PhotoRepository photoRepository1, ReservationRepository reservationsRepository, AuthenticationProvider authenticationProvider) {
        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.photoService = photoService;
        this.photoRepository = photoRepository1;
        this.reservationsRepository = reservationsRepository;
        this.authenticationProvider = authenticationProvider;
    }

    public String getUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUsername();
        }
        throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
    }

    public List<ChildDTO> getChildren() {
        String email = getUserEmail();
        List<ChildDTO> children = new ArrayList<>();
        for (ObjectId id : userRepository.getByEmail(email).getChildren()) {
            ChildDTO childDTO = new ChildDTO();
            Child child = childRepository.getById(id);
            if (child.isPhoto()) {
                try {
                    childDTO.of(child, photoService.loadPhoto(child.getId()));
                } catch (Exception e) {
                    childDTO.of(child, null);
                }
            } else {
                childDTO.of(child, null);
            }
            children.add(childDTO);
        }
        return children;
    }

    public void putChild(ChildDTO childDTO, MultipartFile photoFile) {
        Child child = setChild(childDTO);
        //make sure id is null
        child.setId(null);
        if (childDTO.isPhotoFile() && photoFile == null) {
            child.setPhoto(false);
        }
        child = childRepository.insert(child);
        User user = this.userRepository.getByEmail(getUserEmail());
        if (childDTO.isPhotoFile() && photoFile != null) {
            photoService.store(photoFile, child.getId());
        }
        user.getChildren().add(child.getId());
        userRepository.save(user);
    }

    public void updateChild(ChildDTO c, ObjectId id, MultipartFile photoFile) {
        User user = this.userRepository.getByEmail(getUserEmail());
        if (!user.getChildren().contains(id))
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        Child child = childRepository.getById(id);
        child.setOther(c.getOther());
        child.setDisability(c.isDisability());
        child.setSurname(c.getSurname());
        child.setName(c.getName());
        child.setGender(c.getGender());
        child.setBirthday(c.getBirthday());
        child.setPhoto(false);
        if (photoFile != null && c.isPhotoFile()) {
            photoService.store(photoFile, child.getId());
            child.setPhoto(true);
        } else if (c.isPhotoFile() && c.getPhoto() != null) {
            child.setPhoto(true);
        }
        childRepository.save(child);
    }

    private Child setChild(ChildDTO c) {
        Child child = new Child();
        child.setBirthday(c.getBirthday());
        child.setGender(c.getGender());
        child.setName(c.getName());
        child.setSurname(c.getSurname());
        child.setDisability(c.isDisability());
        child.setOther(c.getOther());
        child.setPhoto(c.isPhotoFile());
        return child;
    }

    public void editProfileInfo(ProfileInfoDTO profileInfoDTO, MultipartFile file) {
        User user = userRepository.getByEmail(getUserEmail());
        user.setPhoto(false);
        if (file != null && profileInfoDTO.isPhotoFile()) {
            photoService.store(file, user.getId());
            user.setPhoto(true);
        } else if (profileInfoDTO.isPhotoFile() && profileInfoDTO.getPhoto() != null) {
            user.setPhoto(true);
        }
        user.setAltEmail(profileInfoDTO.getAlt_email());
        user.setName(profileInfoDTO.getName());
        user.setSurname(profileInfoDTO.getSurname());
        user.setAddress(profileInfoDTO.getAddress());
        user.setTelNumber(profileInfoDTO.getTelephone());
        userRepository.save(user);
    }

    public ProfileInfoDTO getProfileInformation() {
        ProfileInfoDTO profileInfoDTO = new ProfileInfoDTO();
        User user = userRepository.getByEmail(getUserEmail());
        if (user.isPhoto()) {
            try {
                profileInfoDTO.setPhoto("data:image/JPG;base64,"+photoService.loadPhoto(user.getId()));
            } catch (Exception e) {
                profileInfoDTO.setPhoto("");
            }
        }
        profileInfoDTO.setAddress(user.getAddress());
        profileInfoDTO.setEmail(user.getEmail());
        profileInfoDTO.setAlt_email(user.getAltEmail());
        profileInfoDTO.setName(user.getName());
        profileInfoDTO.setSurname(user.getSurname());
        profileInfoDTO.setTelephone(user.getTelNumber());
        profileInfoDTO.setPhotoFile(user.isPhoto());
        return profileInfoDTO;
    }


    public void deleteChild(ObjectId id) {
        if (!this.userRepository.getByEmail(getUserEmail()).getChildren().contains(id)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }
        User u = userRepository.getByEmail(getUserEmail());
        u.getChildren().remove(id);
        if (photoRepository.getByOwner(id) != null) {
            photoService.deletePhoto(photoRepository.getByOwner(id).getId());
            photoRepository.deleteByOwner(id);
        }
        reservationsRepository.deleteByChildId(id);
        userRepository.save(u);
        childRepository.deleteById(id.toString());
    }

    @Autowired
    PasswordEncoder encoder;
    private AuthenticationProvider authenticationProvider;

    public void changePassword(ChangePasswordDTO cp) {
        authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(getUserEmail(), cp.getOldpass()));
        if(cp.getPass().equals(cp.getRepass())) {
            User user = userRepository.getByEmail(getUserEmail());
            user.setPassword(encoder.encode(cp.getPass()));
            userRepository.save(user);
        }else{
            throw new HttpClientErrorException(HttpStatus.PRECONDITION_FAILED);
        }
    }
}
