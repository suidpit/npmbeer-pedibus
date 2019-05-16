package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.dtos.UserDTO;
import it.polito.ai.pedibus.api.models.SystemAuthority;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import it.polito.ai.pedibus.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.sql.Timestamp;
import java.util.ArrayList;
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

    @Autowired
    AuthenticationProvider authenticationProvider;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    PasswordEncoder encoder;

    Logger logger = LoggerFactory.getLogger(UserService.class);

    @Override
    public String signin(String email, String password) {
        try{
            authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(email, password));
//            User user = getUserByEmail(email);
//            if(!user.isEnabled()){
//                throw new DisabledException("User not Enabled");
//            }
//            if(!encoder.encode(password).equals(user.getPassword())){
//                throw new BadCredentialsException("Wrong Password");
//            }
            return jwtTokenProvider.createToken(email, null);
        }catch(AuthenticationException e){
            logger.info(e.getMessage());
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }

    @Override
    public User registerNewUserAccount(UserDTO accountDto)
            throws EmailExistsException {

        if (emailExist(accountDto.getEmail())) {
            throw new EmailExistsException(
                    "There is an account with that email address: "
                            + accountDto.getEmail());
        }
        ArrayList<String> roles = new ArrayList<>();
        roles.add("USER");
        ArrayList<SystemAuthority> authorities = new ArrayList<>();
        SystemAuthority authority = new SystemAuthority();
        authority.setAuthority(SystemAuthority.Authority.USER);
        authority.setLine_names(new ArrayList<>());
        authorities.add(authority);

        User user = new User();
        user.setEmail(accountDto.getEmail());
        user.setPassword(encoder.encode(accountDto.getPass()));
        user.setRoles(roles);
        user.setAuthorities(authorities);
        user.setEnabled(false);

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
       return userRepository.getByEmail(email);

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
    public RecoveryToken getRecoveryToken(String recoveryToken) {
        return recoveryTokenRepository.findByToken(recoveryToken);
    }

    @Override
    public void userChangePassword(User user, String pass) {

        user.setPassword(pass);
        userRepository.save(user);
    }

    @Override
    public void expireRecoveryToken(RecoveryToken recoveryToken) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Timestamp(-1));
        Date expired = new Date(cal.getTime().getTime());
        recoveryToken.setExpiryDate(expired);
        recoveryTokenRepository.save(recoveryToken);
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
