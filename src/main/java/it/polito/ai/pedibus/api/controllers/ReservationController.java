package it.polito.ai.pedibus.api.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<Reservation> getReservaions(){
        return reservationRepository.findAll();
    }

/*    GET /reservations/{nome_linea}/{data} – restituisce un oggetto JSON contenente due liste,
    riportanti, per ogni fermata di andata e ritorno, l’elenco delle persone che devono essere
    prese in carico / lasciate in corrispondenza della fermata*/
    @RequestMapping(value = "/{line_name}/{data}", method = RequestMethod.GET)
    public String getListChildForStop(@PathVariable("line_name") String line_name,
                                           @PathVariable("data")String data){
        //ovvero <"Sale o Scende", <"Nome Fermata", [Lista di gente che sale o scende]>>
        HashMap<String, HashMap<String, ArrayList<String>>> mappazza = new HashMap<>();
        //<Fermata,<ListaBambini>>
        HashMap<String,ArrayList<String>> innerMapUp = new HashMap<>();
        HashMap<String,ArrayList<String>> innerMapDown = new HashMap<>();
        List<Reservation> listReservation = reservationRepository.findReservationsByLineData(line_name,data);
        for(Reservation res : listReservation){
            if(res.getStopUpOrDawn().getUp_down().equals(true)){
                //add in innerMapUp
                if(!innerMapUp.containsKey(res.getStopUpOrDawn().getName())){
                    innerMapUp.put(res.getStopUpOrDawn().getName(),new ArrayList<>());
                    innerMapUp.get(res.getStopUpOrDawn().getName()).add(res.getChild());
                }else
                    innerMapUp.get(res.getStopUpOrDawn().getName()).add(res.getChild());
            }
            else{
                if(!innerMapDown.containsKey(res.getStopUpOrDawn().getName())){
                    innerMapDown.put(res.getStopUpOrDawn().getName(),new ArrayList<>());
                    innerMapDown.get(res.getStopUpOrDawn().getName()).add(res.getChild());
                }else
                    innerMapDown.get(res.getStopUpOrDawn().getName()).add(res.getChild());
            }
        }
        mappazza.put("Andata",innerMapUp);
        mappazza.put("Discesa",innerMapDown);
        try {
            String json = new ObjectMapper().writeValueAsString(mappazza);
            return json;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "no";
    }


    /*POST /reservations/{nome_linea}/{data} – invia un oggetto JSON contenente il nome
    dell’alunno da trasportare, l’identificatore della fermata a cui sale/scende e il verso di
    percorrenza (andata/ritorno); restituisce un identificatore univoco della prenotazione
    creata*/
    @RequestMapping(value = "/{line_name}/{data}", method = RequestMethod.POST)
            public ObjectId insert(@PathVariable("line_name") String line_name,
                               @PathVariable("data")String data,
                               @RequestBody Reservation reservation){
                reservation.setDate(data);
                reservation.setLine_name(line_name);
                this.reservationRepository.insert(reservation);
                return  reservation.getId();
        }
//
//   /* PUT /reservations/{nome_linea}/{data}/{reservation_id} – invia un oggetto JSON che
//    permette di aggiornare i dati relativi alla prenotazione indicata*/
//    //@PutMapping(value = "/reservations/{nome_linea}/{data}/{reservation_id}")
//
    //NB Insert also ID in JSON
    //Issues: If I put wrong parameters it save anyway and add a field in db called :"_class"
    //2019-04-16 08:50:09.192 DEBUG 14804 --- [nio-8080-exec-1] o.s.data.mongodb.core.MongoTemplate      : Saving Document containing fields: [_id, res_name, data, line_name, child, _class]
    @RequestMapping(value = "/{line_name}/{data}/{id}", method = RequestMethod.PUT)
        public void update(@PathVariable("line_name") String line_name,
                           @PathVariable("data")String data,
                           @PathVariable("id")ObjectId id,
                           @Valid @RequestBody Reservation reservation){
            Reservation resToEdit = reservationRepository.findReservationByLineDataId(id,line_name,data);
            try {
                if(resToEdit.getId().equals(reservation.getId()))
                    this.reservationRepository.save(reservation);
            } catch (Exception e) { //In this case there isn't a match -> NULL POINTER EXC
                e.printStackTrace();
            }
    }

//   /* DELETE /reservations/{nome_linea}/{data}/{reservation_id} – elimina la prenotazione
//            indicata*/
    @RequestMapping(value = "/{line_name}/{data}/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("line_name") String line_name,
                                      @PathVariable("data")String data,
                                      @PathVariable("id")ObjectId id)
    {
        // this.reservationRepository.deleteById(id);//FUNZIONA!
       this.reservationRepository.deleteByIdLineData(id,line_name,data);

    }

/*
    GET /reservations/{nome_linea}/{data}/{reservation_id} – restituisce la prenotazione
*/
    @RequestMapping(value = "/{line_name}/{data}/{id}", method = RequestMethod.GET)
    public Reservation getReservation(@PathVariable("line_name") String line_name,
                                      @PathVariable("data")String data,
                                      @PathVariable("id")ObjectId id)
    {
        //Should be one element
        Reservation res = this.reservationRepository.findReservationByLineDataId(id,line_name,data);
        return res;
    }


 //___________MIA PROVA_________________
 @RequestMapping(value = "/{data}", method = RequestMethod.GET)
 public List<Reservation> getDatas(@PathVariable("data") String data){
    // return reservationRepository.findByData(data);
     return reservationRepository.findReservationByData(data);
 }

}
