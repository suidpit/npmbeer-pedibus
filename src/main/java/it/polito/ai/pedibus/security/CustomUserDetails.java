package it.polito.ai.pedibus.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class CustomUserDetails implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        final User user = userRepository.getByEmail();

        if(user == null){
            throw new UsernameNotFoundException("No such a user");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password(user.getPassword())
                .authorities(user.getRoles())
                .disabled(user.isEnabled())
                .build();
    }
}
