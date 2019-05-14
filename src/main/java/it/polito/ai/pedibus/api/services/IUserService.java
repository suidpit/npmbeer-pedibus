package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;

public interface IUserService {
    User registerNewUserAccount(UserDTO accountDto)
            throws EmailExistsException;

    User getUser(String verificationToken);

    void saveRegisteredUser(User user);

    void enableUser(User user);

    void createVerificationToken(User user, String token);

    ModelEmailVerificationToken getVerificationToken(String VerificationToken);
}
