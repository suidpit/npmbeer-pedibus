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

    public class LineGrantedAuthority implements GrantedAuthority{

        private SystemAuthority.Authority authority;

        //TODO: line list
        private List<String> lineNames;

        public LineGrantedAuthority(SystemAuthority.Authority authority, List<String> lineNames){
            this.authority = authority;
            this.lineNames = lineNames;
        }

        @Override
        public String getAuthority() {
            return this.authority.name();
        }

        public List<String> getLineNames(){
            return this.lineNames;
        }

        @Override
        public String toString(){
            return this.authority.name()+": "+this.lineNames.toString();
        }
    }
}
