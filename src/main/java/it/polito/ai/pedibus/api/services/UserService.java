package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.crypto.Data;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Override
    public User registerNewUserAccount(UserDTO accountDto)
            throws EmailExistsException {

        if (emailExist(accountDto.getEmail())) {
            throw new EmailExistsException(
                    "There is an account with that email adress: "
                            + accountDto.getEmail());
        }

        User user = User.builder()
                .email(accountDto.getEmail())
                .password(accountDto.getPass())
                .enabled(false)
                .build();
        return repository.save(user);
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
        User user = tokenRepository.findByToken(verificationToken).getUser();
        return user;
    }

    @Override
    public ModelEmailVerificationToken getVerificationToken(String VerificationToken) {
        return tokenRepository.findByToken(VerificationToken);
    }

    @Override
    public void saveRegisteredUser(User user) {
        repository.save(user);
    }

    @Override
    public void createVerificationToken(User user, String token) {

        ModelEmailVerificationToken myToken = ModelEmailVerificationToken
                .builder()
                .user(user)
                .token(token)
                .build();
        myToken.setExpiryDate(myToken.calculateExpiryDate(60));
        tokenRepository.insert(myToken);
    }
}
