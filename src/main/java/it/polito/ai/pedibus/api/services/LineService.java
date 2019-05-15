package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LineService {

    private final LineRepository lineRepository;

    public LineService(LineRepository lineRepository) {
        this.lineRepository = lineRepository;
    }

    public List<Line> getAllLines() {
        return lineRepository.findAll();
    }

    public Line getLine(String name) {
        return lineRepository.findByName(name);
    }
}
