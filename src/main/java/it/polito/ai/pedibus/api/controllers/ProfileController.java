package it.polito.ai.pedibus.api.controllers;

import com.mongodb.lang.Nullable;
import it.polito.ai.pedibus.api.dtos.ChangePasswordDTO;
import it.polito.ai.pedibus.api.dtos.ChildDTO;
import it.polito.ai.pedibus.api.dtos.ProfileInfoDTO;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.services.ProfileService;
import org.bson.types.ObjectId;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;
    public ProfileController(ProfileService profileService) {
        this.profileService= profileService;
    }

    @RequestMapping(value = "/children", method = RequestMethod.GET)
    public List<ChildDTO> getChildren() {
        return profileService.getChildren();
    }

    @Transactional
    @RequestMapping(value = "/children", method = RequestMethod.POST)
    public void putChild(@RequestPart("child") @Valid ChildDTO childDTO, @RequestPart("photo") @Nullable MultipartFile file) {
        profileService.putChild(childDTO, file);
    }

    @Transactional
    @RequestMapping(value = "/children/{id}", method = RequestMethod.PUT)
    public void updateChild(@RequestPart("child") @Valid ChildDTO child, @RequestPart("photo") @Nullable MultipartFile file, @PathVariable ObjectId id) {
        profileService.updateChild(child, id, file);
    }

    @Transactional
    @RequestMapping(value = "/children/{id}", method = RequestMethod.DELETE)
    public void deleteChild(@PathVariable ObjectId id) {
        profileService.deleteChild(id);
    }

    @Transactional
    @RequestMapping(value = "/information", method = RequestMethod.PUT)
    public void editInfo(@RequestPart("user") @Valid ProfileInfoDTO profileInfoDTO, @RequestPart("photo") @Nullable MultipartFile file) {
        profileService.editProfileInfo(profileInfoDTO, file);
    }

    @RequestMapping(value = "/information", method = RequestMethod.GET)
    public ProfileInfoDTO getUserProfileInformation() {
        return profileService.getProfileInformation();
    }

    @RequestMapping(value = "/changePassword", method = RequestMethod.PUT)
    public void changePassword(@RequestBody @Valid ChangePasswordDTO cp){
        profileService.changePassword(cp);
    }

}
