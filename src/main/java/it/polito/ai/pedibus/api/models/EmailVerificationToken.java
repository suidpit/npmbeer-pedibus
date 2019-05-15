package it.polito.ai.pedibus.api.models;

import it.polito.ai.pedibus.api.models.User;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

@Data
@Builder
@Document(collection = "emailTokens")
public class EmailVerificationToken {
    private static final int EXPIRATION = 60 * 24;

        @Id
        private ObjectId objectId;
        private String token;

       /* @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
        @JoinColumn(nullable = false, name = "user_id")*/
        private User user;

        private Date expiryDate;

        public Date calculateExpiryDate(int expiryTimeInMinutes) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(new Timestamp(cal.getTime().getTime()));
            cal.add(Calendar.MINUTE, expiryTimeInMinutes);
            return new Date(cal.getTime().getTime());
        }

        // standard constructors, getters and setters
}