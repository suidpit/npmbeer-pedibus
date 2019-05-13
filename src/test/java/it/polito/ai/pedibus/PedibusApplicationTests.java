package it.polito.ai.pedibus;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class PedibusApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void creatingNewReservationWorksAsExpected() throws Exception {
        Reservation reservation = objectMapper.readValue(new File("resources/reservation1.json"), Reservation.class);

        mockMvc.perform(post("/reservations/linea2/12122012}")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(reservation)))
                .andExpect(status().isOk());
    }
}
