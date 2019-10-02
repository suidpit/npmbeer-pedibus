package it.polito.ai.pedibus.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.token.secret:secret}")
    private String key;

    @Value("${security.jwt.token.validityHours:2}")
    private Integer validityHours;

    @Value("${security.jwt.token.issuer:issuer}")
    private String issuer;

    private Algorithm signingAlgorithm;

    private CustomUserDetailsService userDetailsService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    public JwtTokenProvider(CustomUserDetailsService userDetailsService){
        this.userDetailsService = userDetailsService;
    }

    @PostConstruct
    protected void init(){
        this.key = Base64.getEncoder().encodeToString(this.key.getBytes());
        this.signingAlgorithm = Algorithm.HMAC256(this.key);
    }

    public String createToken(String username, HashMap<String,List<String>> authorities, String user_id){
        Date notBefore = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(notBefore);
        calendar.add(Calendar.HOUR_OF_DAY, this.validityHours);
        Date expiresAt = calendar.getTime();

        return JWT.create() // returns a Builder
                .withClaim("email", username)
                .withClaim("user_id", user_id)
                .withClaim("authorities", new JSONObject(authorities).toString())
                .withNotBefore(notBefore)
                .withExpiresAt(expiresAt)
                .withIssuer(this.issuer)
                .sign(this.signingAlgorithm);
    }

    // TODO: could be void.
    public boolean validateToken(String token) throws AuthenticationException{
        try {
            DecodedJWT jwt = JWT.decode(token);
            Date now = new Date();
            if(now.before(jwt.getNotBefore()) || now.after(jwt.getExpiresAt())){
                throw new TokenExpiredException("");
            }
            JWTVerifier verifier = JWT.require(this.signingAlgorithm).build();
            verifier.verify(jwt);
            return true;
        }
        catch (JWTVerificationException e) { // TokenExpiredException is a subclass of JWTVerificationException
            throw new AuthenticationException("Invalid or Expired JWT token");
        }
    }

    public String retrieveToken(HttpServletRequest req){
        String authHeader = req.getHeader("Authorization");
        if(authHeader != null) {
            String[] split = authHeader.split(" ");
            if(split[0].toLowerCase().equals("bearer")){
                return split[1];
            }
        }
        return null;
    }

    public Authentication getAuthentication(String token){
        UserDetails userDetails = userDetailsService.loadUserByUsername(extractUsername(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    private String extractUsername(String token){
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getClaim("email").asString();
    }
}
