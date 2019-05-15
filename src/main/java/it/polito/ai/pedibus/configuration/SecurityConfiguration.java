package it.polito.ai.pedibus.configuration;

import it.polito.ai.pedibus.security.JwtAuthenticationFilter;
import it.polito.ai.pedibus.security.JwtTokenProvider;
import it.polito.ai.pedibus.security.JwtTokenValidationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.authentication.AuthenticationManagerBeanDefinitionParser;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationEntryPoint entryPoint(){
        return new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED);
    }

    private AuthenticationSuccessHandler sh;
    private AuthenticationFailureHandler fh;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("Admin")
                .password(encoder().encode("admin"))
                .roles("USER", "ADMIN")
            .and()
                .withUser("Napalm")
                .password(encoder().encode("Beer"))
                .roles("ADMIN");
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .csrf().disable()
                .sessionManagement().disable();

        http
            .authorizeRequests()
                .antMatchers("/login").permitAll()
                .antMatchers("/register").permitAll()
                .antMatchers("/confirm/**").permitAll()
                .antMatchers("/recover").permitAll()
                .antMatchers("/recover/**").permitAll()
                .anyRequest().authenticated();

        http.addFilterBefore(new JwtTokenValidationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class);
    }
}
