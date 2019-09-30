import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Line} from '../../models/line';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators'
import {Reservations} from "../../models/reservations";
import {Child} from "../../models/child";
import {Builder} from "builder-pattern";
import {StopList} from "../../models/stop-list";
import {LocalTime} from "js-joda";
import {Stop} from "../../models/stop";
import {Reservation} from "../../models/reservation";
import {AuthService} from "../auth/auth.service";
import {IReservation} from "../../models/ireservation";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private base_url = "http://localhost:8080";
  constructor(private http: HttpClient) {
  }

  lines(): Observable<Line[]> {
    //TODO:  This will go in a config file
    let api_url = this.base_url + "/lines";
    return this.http.get<Line[]>(api_url).pipe(map((data) => {
      return data.map((line) => {
        let l = new Line(line);
        for (let i = 0; i < l.outward.length; i++) {
          let sl: any = l.outward[i];
          let stops: Stop[] = [];
          sl.forEach((s) => {
            stops.push(
                Builder(Stop)
                    .name(s.name)
                    .position(s.position)
                    .time(LocalTime.parse(s.time))
                    .build());
          });
          l.outward[i] = new StopList();
          l.outward[i].stops = stops;
        }
        for (let i = 0; i < l.back.length; i++) {
          let sl: any = l.back[i];
          let stops: Stop[] = [];
          sl.forEach((s) => {
            stops.push(
                Builder(Stop)
                    .name(s.name)
                    .position(s.position)
                    .time(LocalTime.parse(s.time))
                    .build());
          });
          l.back[i] = new StopList();
          l.back[i].stops = stops;
        }
        return l;
      });
    }));
  }

  // date has format: ddMMyyyy
  reservations(line: string, date): Observable<Reservations> {
    let api_url = this.base_url+"/reservations/admin/" + line + "/" + date;
    return this.http.get<Reservations>(api_url).pipe(map(data => {
      let outwards: Array<Reservation[]> = [];
      let backs: Array<Reservation[]> = [];
      // map outwards
      for (let out of data.outward) {
        let o: Reservation[] = [];
        for (let stop of Object.keys(out)) {
          let childs: Child[] = [];
          for (let c of out[stop]) {
            let child = Builder(Child)
                .name(c)
                .present(false)
                .build();
            childs.push(child);
          }
          let res = Builder(Reservation)
              .stopName(stop)
              .childs(childs)
              .build();
          o.push(res);
        }
        outwards.push(o);
      }
      for (let back of data.backward) {
        let b: Reservation[] = [];
        for (let stop of Object.keys(back)) {
          let childs: Child[] = [];
          for (let c of back[stop]) {
            let child = Builder(Child)
                .name(c)
                .present(false)
                .build();
            childs.push(child);
          }
          let res = Builder(Reservation)
              .stopName(stop)
              .childs(childs)
              .build();
          b.push(res);
        }
        backs.push(b);
      }
      return Builder(Reservations)
          .outward(outwards)
          .backward(backs)
          .build();
    }));
  }

  // date has format: ddMMyyyy
  todayReservations(): Observable<IReservation[]> {
    let api_url = this.base_url+"/reservations/user/today";
    return this.http.get<IReservation[]>(api_url);
    /*.pipe(map(data => {
      debugger;
      if(data.length > 0){
        let outwards: Array<Reservation[]> = [];
        let backs: Array<Reservation[]> = [];
        // map outwards
        for (let out of data.outward) {
          let o: Reservation[] = [];
          for (let stop of Object.keys(out)) {
            let childs: Child[] = [];
            for (let c of out[stop]) {
              let child = Builder(Child)
                .name(c)
                .present(false)
                .build();
              childs.push(child);
            }
            let res = Builder(Reservation)
              .stopName(stop)
              .childs(childs)
              .build();
            o.push(res);
          }
          outwards.push(o);
        }
        for (let back of data.backward) {
          let b: Reservation[] = [];
          for (let stop of Object.keys(back)) {
            let childs: Child[] = [];
            for (let c of back[stop]) {
              let child = Builder(Child)
                .name(c)
                .present(false)
                .build();
              childs.push(child);
            }
            let res = Builder(Reservation)
              .stopName(stop)
              .childs(childs)
              .build();
            b.push(res);
          }
          backs.push(b);
        }
        return Builder(Reservations)
          .outward(outwards)
          .backward(backs)
          .build();
      }
    }));*/
  }
}
