package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.repositories.ReservationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<Reservation> getLines(){
        return reservationRepository.findAll();
    }

/*    GET /reservations/{nome_linea}/{data} – restituisce un oggetto JSON contenente due liste,
    riportanti, per ogni fermata di andata e ritorno, l’elenco delle persone che devono essere
    prese in carico / lasciate in corrispondenza della fermata*/
   /* @RequestMapping(value = "/{line_name}/{data}", method = RequestMethod.GET)
    public Reservation getReservations(@PathVariable("line_name") String line_name, @PathVariable("data")String data){
        Reservation listReservation = reservationRepository.getListFromLineAndData(line_name,data);
        return listReservation;
    }*/


    /*POST /reservations/{nome_linea}/{data} – invia un oggetto JSON contenente il nome
    dell’alunno da trasportare, l’identificatore della fermata a cui sale/scende e il verso di
    percorrenza (andata/ritorno); restituisce un identificatore univoco della prenotazione
    creata*/

    //@PostMapping(value = "/reservations/{nome_linea}/{data}")
//    @PostMapping
//    public void update(@RequestBody Reservation reservation){
//        this.reservationRepository.save(reservation);
//   }
//
//   /* PUT /reservations/{nome_linea}/{data}/{reservation_id} – invia un oggetto JSON che
//    permette di aggiornare i dati relativi alla prenotazione indicata*/
//    //@PutMapping(value = "/reservations/{nome_linea}/{data}/{reservation_id}")
//
//    @PutMapping
//    public void insert(@RequestBody Reservation reservation){
//        this.reservationRepository.insert(reservation);
//    }
//
//   /* DELETE /reservations/{nome_linea}/{data}/{reservation_id} – elimina la prenotazione
//            indicata*/
//   @RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
//   public void delete(@PathVariable("id") ObjectId id){
//        this.reservationRepository.deleteById(id);
//   }

    @RequestMapping(value = "/{line_name}/{data}/{id}",method = RequestMethod.DELETE)
    public void delete(@PathVariable("line_name") String line_name,
                       @PathVariable("data")String data,
                       @PathVariable("id")ObjectId id)
    {
        this.reservationRepository.deleteById(id);
    }

}
