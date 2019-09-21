package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.ChildDTO;
import it.polito.ai.pedibus.api.dtos.ProfileInfoDTO;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Service
public class ProfileService {
    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String getUserEmail(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUsername();
        }
        throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
    }

    public List<Child> getChildren(){
        String email = getUserEmail();
        return userRepository.getByEmail(email).getChildren();
    }

    public void putChild(ChildDTO childDTO) {
/*
        User user = userRepository.getByEmail(childDTO.getEmail());
        if (user.getChildren().size() >= 3)
            throw new TooManyChildrenException();
        HashMap<String, String> child = new HashMap<>();
*/
        Child child = new Child();
        child.setBirthday(childDTO.getBirthday());
        child.setGender(childDTO.getGender());
        child.setName(childDTO.getName());
        child.setSurname(childDTO.getSurname());
        User user = this.userRepository.getByEmail(getUserEmail());
        user.getChildren().add(child);
        userRepository.save(user);
    }

    public void editProfileInfo(ProfileInfoDTO profileInfoDTO){
        User user = userRepository.getByEmail(profileInfoDTO.getEmail());
        user.setName(profileInfoDTO.getName());
        user.setSurname(profileInfoDTO.getSurname());
        user.setAddress(profileInfoDTO.getAddress());
        user.setTelNumber(profileInfoDTO.getTelephone());
        userRepository.save(user);
    }

    public ProfileInfoDTO getProfileInformation(){
        User user = userRepository.getByEmail(getUserEmail());
        ProfileInfoDTO profileInfoDTO = new ProfileInfoDTO();
        profileInfoDTO.setAddress(user.getAddress());
        profileInfoDTO.setEmail(user.getEmail());
        profileInfoDTO.setName(user.getName());
        profileInfoDTO.setSurname(user.getSurname());
        profileInfoDTO.setTelephone(user.getTelNumber());
        return profileInfoDTO;

    }
}
