package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/lines")
public class LineController {

    @Autowired
    private LinesRepository linesRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Line> getLines(){
        return linesRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Line getLineById(@PathVariable("id")ObjectId id){
        return linesRepository.findById(id);
    }
}
