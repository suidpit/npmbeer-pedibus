package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.ChildDTO;
import it.polito.ai.pedibus.api.dtos.EmailDTO;
import it.polito.ai.pedibus.api.dtos.ProfileInfoDTO;
import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.exceptions.EmailExistsException;
import it.polito.ai.pedibus.api.models.EmailVerificationToken;
import it.polito.ai.pedibus.api.models.RecoveryToken;
import it.polito.ai.pedibus.api.models.User;
import org.bson.types.ObjectId;

import java.util.HashMap;
import java.util.List;

public interface IUserService {

    HashMap<String, String> signin(String email, String password);

    User registerNewUserEmail(EmailDTO emailDTO)
            throws EmailExistsException;

    User registerNewUserAccount(UserDTO accountDto)
            throws EmailExistsException;

    User getUser(String verificationToken);

    void saveRegisteredUser(User user);

    void enableUser(User user);

    void createVerificationToken(User user, String token);

    EmailVerificationToken getVerificationToken(String VerificationToken);

    EmailVerificationToken getVerificationTokenByUser(User user);

    User getUserByEmail(String email);

    User getUserById(ObjectId id);

    void createRecoveryToken(User user, String token);

    RecoveryToken getRecoveryToken(String token);

    void userChangePassword(User user, String pass);

    void expireRecoveryToken(RecoveryToken recoveryToken);

    void expireRegistationToken(EmailVerificationToken verificationToken);

    boolean isUserEnabled(User user);

    boolean checkPwd(User user, String pwdTocheck);

    void enableUserAndAddPassword(User user, String pass);
}
