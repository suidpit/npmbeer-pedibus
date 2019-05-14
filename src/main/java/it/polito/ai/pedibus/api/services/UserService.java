package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;

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
        return repository.insert(user);
    }

    private boolean emailExist(String email) {
        User user = repository.findByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }

    @Override
    public User getUser(String verificationToken) {
        User user = emailVerificationTokenRepository.findByToken(verificationToken).getUser();
        return user;
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
    public User getUserByEmail(String email) {
       return repository.getByEmail(email);

    }

    @Override
    public void createRecoveryToken(User user, String token) {
        RecoveryToken recoveryToken = RecoveryToken
                .builder()
                .user(user)
                .token(token)
                .build();
        recoveryToken.setExpiryDate(recoveryToken.calculateExpiryDate(60));
        recoveryToken.getUser().setEnabled(true);
        recoveryTokenRepository.insert(recoveryToken);
    }

    @Override
    public void saveRegisteredUser(User user) {
        repository.save(user);
    }

    @Override
    public void enableUser(User user){
        user.setEnabled(true);
        repository.save(user);
    }


    @Override
    public void createVerificationToken(User user, String token) {

        EmailVerificationToken myToken = EmailVerificationToken
                .builder()
                .user(user)
                .token(token)
                .build();
        myToken.setExpiryDate(myToken.calculateExpiryDate(60));
        myToken.getUser().setEnabled(true);
        emailVerificationTokenRepository.insert(myToken);
    }
}
