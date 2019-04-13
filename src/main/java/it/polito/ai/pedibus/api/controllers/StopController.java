package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.models.Stop;
import it.polito.ai.pedibus.api.repositories.StopsRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/stops")
public class StopController {
    @Autowired
    private StopsRepository repo;

    @RequestMapping(value= "/", method = RequestMethod.GET)
    public List<Stop> getAllStops() {
        return repo.findAll();
    }

    @RequestMapping(value= "/{id}", method = RequestMethod.GET)
    public Stop getStopById(@PathVariable("id") ObjectId id) {
        return repo.findById(id);
    }
}
