package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.dtos.ChildDTO;
import it.polito.ai.pedibus.api.dtos.ProfileInfoDTO;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.services.ProfileService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
    public List<Child> getChildren() {
        return profileService.getChildren();
    }

    @Transactional
    @RequestMapping(value = "/children", method = RequestMethod.POST)
    public void putChild(@RequestBody ChildDTO childDTO) {
        profileService.putChild(childDTO);
    }

    @Transactional
    @RequestMapping(value = "/profile", method = RequestMethod.POST)
    public void editInfo(@RequestBody ProfileInfoDTO profileInfoDTO) {
        profileService.editProfileInfo(profileInfoDTO);
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public ProfileInfoDTO getUserProfileInformation() {
        return profileService.getProfileInformation();
    }

}
