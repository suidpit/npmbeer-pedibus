package it.polito.ai.pedibus.api.controllers;

import it.polito.ai.pedibus.api.models.Line;
import it.polito.ai.pedibus.api.repositories.LinesRepository;
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

    /**
     * GET /lines – restituisce una lista JSON con i nomi delle linee presenti nel DBMS.
     * @return una List<Line> contenente gli oggetti presi dal repository.
     */
    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Line> getLines(){
        return linesRepository.findAll();
    }

    /**
     * GET /lines/{nome_linea} – restituisce un oggetto JSON contenente due liste, riportanti i
     * dettagli delle fermate di andata e ritorno; ciascuna fermata sarà etichettata con un proprio
     * codice univoco, assegnato dal DB all’atto dell’importazione del file
     * @param name
     * @return la Linea estratta dal DB.
     */
    @RequestMapping(value = "/{nome_linea}", method = RequestMethod.GET)
    public Line getLineByName(@PathVariable("nome_linea")String name){
        return linesRepository.findByName(name);
    }
}
