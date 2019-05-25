package it.polito.ai.pedibus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LineRepository;
import it.polito.ai.pedibus.api.services.LineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.io.File;
import java.util.Arrays;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class LineServiceTest {

    @Mock
    private LineRepository lineRepository;

    private LineService lineService;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void initUseCase() {
        this.lineService = new LineService(lineRepository);
        this.objectMapper = new ObjectMapper();
    }

    @Test
    public void loadedLinesAreReturnedAsArray() {
        try {
            objectMapper.registerModule(new JavaTimeModule());

            Line l1 = objectMapper.readValue(new File("src/test/resources/test_line-1.json"), Line.class);
            Line l2 = objectMapper.readValue(new File("src/test/resources/test_line-2.json"), Line.class);

            List<Line> lines = Arrays.asList(l1, l2);
            when(lineRepository.findAll()).thenReturn(lines);

            assertThat(lineService.getAllLines()).containsExactly(l1, l2);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @Test
    public void findByNameReturnsCorrectLine() {
        try {
            objectMapper.registerModule(new JavaTimeModule());
            Line l1 = objectMapper.readValue(new File("src/test/resources/test_line-1.json"), Line.class);

            when(lineRepository.findByName("linea1")).thenReturn(l1);

            assertThat(lineService.getLine("linea1")).isEqualTo(l1);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
