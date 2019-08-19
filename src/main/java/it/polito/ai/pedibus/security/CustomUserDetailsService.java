package it.polito.ai.pedibus.security;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        final User user = userRepository.getByEmail(email);

        if(user == null){
            throw new UsernameNotFoundException("No such a user");
        }

        List<GrantedAuthority> authorities = user.getAuthorities().stream()
                .map(a -> new LineGrantedAuthority(a.getAuthority(), a.getLine_names()))
                .collect(Collectors.toList());

        for(String role: user.getRoles()){
            authorities.add(new SimpleGrantedAuthority(role));
        }

        return CustomUserDetails.builder()
                .id(user.getId())
                .username(email)
                .password(user.getPassword())
                .authorities(authorities)
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(user.isEnabled())
                .build();
    }
}

