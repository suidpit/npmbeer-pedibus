package it.polito.ai.pedibus.api.services;

import it.polito.ai.pedibus.api.models.Shift;
import it.polito.ai.pedibus.api.repositories.ShiftRepository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;

    @Qualifier("fmt")
    private final DateTimeFormatter fmt;


    public ShiftService(ShiftRepository shiftRepository, DateTimeFormatter fmt) {
        this.shiftRepository = shiftRepository;
        this.fmt = fmt;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }


}
