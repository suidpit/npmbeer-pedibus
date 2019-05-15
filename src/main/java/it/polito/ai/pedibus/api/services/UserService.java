package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private RecoveryTokenRepository recoveryTokenRepository;

    @Override
    public User registerNewUserAccount(UserDTO accountDto)
            throws EmailExistsException {

        if (emailExist(accountDto.getEmail())) {
            throw new EmailExistsException(
                    "There is an account with that email address: "
                            + accountDto.getEmail());
        }

        User user = User.builder()
                .email(accountDto.getEmail())
                .password(accountDto.getPass())
                .enabled(false)
                .build();
        return userRepository.insert(user);
    }

    private boolean emailExist(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.getByEmail(email);

    }

    @Override
    public void userChangePassword(User user, String pass) {

        user.setPassword(pass);
        userRepository.save(user);
    }
    @Override
    public void saveRegisteredUser(User user) {
        userRepository.save(user);
    }

    @Override
    public void enableUser(User user){
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public User getUser(String verificationToken) {
        return emailVerificationTokenRepository.findByToken(verificationToken).getUser();

    }

    @Override
    public EmailVerificationToken getVerificationToken(String VerificationToken) {
        return emailVerificationTokenRepository.findByToken(VerificationToken);
    }

    @Override
    public EmailVerificationToken getVerificationTokenByUser(User user) {
        return emailVerificationTokenRepository.findByUser(user);
    }

    @Override
    public void createVerificationToken(User user, String token) {

        EmailVerificationToken myToken = EmailVerificationToken
                .builder()
                .user(user)
                .token(token)
                .expiryDate(RecoveryToken.calculateExpiryDate())
                .build();
        //myToken.setExpiryDate(myToken.calculateExpiryDate(60));
        myToken.getUser().setEnabled(true);
        emailVerificationTokenRepository.insert(myToken);
    }

    @Override
    public void createRecoveryToken(User user, String token) {
        RecoveryToken recoveryToken = RecoveryToken
                .builder()
                .user(user)
                .token(token)
                .expiryDate(RecoveryToken.calculateExpiryDate())
                .build();
        //recoveryToken.setExpiryDate(recoveryToken.calculateExpiryDate());
        recoveryToken.getUser().setEnabled(true);
        recoveryTokenRepository.insert(recoveryToken);
    }

    @Override
    public RecoveryToken getRecoveryToken(String recoveryToken) {
        return recoveryTokenRepository.findByToken(recoveryToken);
    }

    @Override
    public void expireRecoveryToken(RecoveryToken recoveryToken) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Timestamp(-1));
        Date expired = new Date(cal.getTime().getTime());
        recoveryToken.setExpiryDate(expired);
        recoveryTokenRepository.save(recoveryToken);
    }


}
