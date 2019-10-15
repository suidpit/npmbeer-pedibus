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
import {IReservation} from "../../models/ireservation";
import {IChildReservationInfo} from "../../models/ichild-reservation-info";
import {ReservationReq} from "../../models/reservation-req";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private base_url = "http://192.168.99.100:8080";
  constructor(private http: HttpClient) {
  }

  lines(): Observable<Line[]> {
    let api_url = this.base_url + "/lines";
    return this.http.get<Line[]>(api_url).pipe(map((data) => {
      return data.map((line) => {
        return new Line(line);
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
          let childs: IChildReservationInfo[] = [];
          let childResInfo: IChildReservationInfo;

          for (childResInfo of out[stop]) {
            childs.push(childResInfo);
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
          let childs: IChildReservationInfo[] = [];
          let childResInfo: IChildReservationInfo;

          for (childResInfo of back[stop]) {
            childs.push(childResInfo);
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

  getNotReservedKids(dateString: string, lineName: string, direction: string, tripIndex: number):Observable<string[]>{
    return this.http.get<string[]>(`${this.base_url}/reservations/admin/not-reserved/${dateString}/${lineName}/${direction}/${tripIndex}`);
  }

  togglePresence(resid: string, isPresent: boolean): Observable<any>{
    return this.http.post(`${this.base_url}/reservations/admin/presence/${resid}`, {});
  }

  addOnTheFlyChild(childId: string, stopName: string, lineName: string, direction: string, tripIndex: number, dateString: string){
    console.log("OK");
    const reservation = Builder(ReservationReq)
      .stopName(stopName)
      .child(childId)
      .direction(direction.toUpperCase())
      .tripIndex(tripIndex)
      .build();
    return this.http.post(`${this.base_url}/reservations/admin/add-on-the-fly/${lineName}/${dateString}`, JSON.stringify(reservation));
  }
}
