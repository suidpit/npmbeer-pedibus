package it.polito.ai.pedibus.security;

import it.polito.ai.pedibus.api.models.SystemAuthority;
import it.polito.ai.pedibus.api.models.User;
import it.polito.ai.pedibus.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetails implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        final User user = userRepository.getByEmail(email);

        if(user == null){
            throw new UsernameNotFoundException("No such a user");
        }

        List<GrantedAuthority> authorities = user.getAuthorities().stream()
                .map(a -> new LineGrantedAuthority(a.getAuthority(), a.getLine_name()))
                .collect(Collectors.toList());

        return org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password(user.getPassword())
                .roles(user.getRoles().toArray(new String[user.getRoles().size()]))
                .authorities(authorities)
                .disabled(user.isEnabled())
                .build();
    }

    private class LineGrantedAuthority implements GrantedAuthority{

        private SystemAuthority.Authority authority;
        private String lineName;

        public LineGrantedAuthority(SystemAuthority.Authority authority, String lineName){
            this.authority = authority;
            this.lineName = lineName;
        }

        @Override
        public String getAuthority() {
            return this.authority+this.lineName;
        }
    }
}
