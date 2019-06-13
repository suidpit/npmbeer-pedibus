import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Line} from './models/line';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators'
import {Reservations} from "./models/reservations";
import {Child} from "./models/child";
import {Builder} from "builder-pattern";
import {StopList} from "./models/stop-list";
import {LocalTime} from "js-joda";
import {Stop} from "./models/stop";
import {Reservation} from "./models/reservation";

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {

    constructor(private http: HttpClient) {
    }

    lines(): Observable<Line[]> {
        //TODO:  This will go in a config file
        let api_url = "http://127.0.0.1:8080/lines"
        console.log("Requesting from service...")
        return this.http.get<Line[]>(api_url).pipe(map((data) => data.map((line) => {
            let outwards: Array<StopList> = [];
            let backs: Array<StopList> = [];
            // map outwards
            for (let out of line.outward) {
                let stopList = Builder(StopList)
                    .stops(out.map(function (stop) {
                        let time = LocalTime.parse(stop.time);
                        return Builder(Stop)
                            .name(stop.name)
                            .time(time)
                            .position(stop.position)
                            .build();
                    }))
                    .build();
                outwards.push(stopList);
            }

            // map inwards
            for (let b of line.back) {
                let stopList = Builder(StopList)
                    .stops(b.map(function (stop) {
                        let time = LocalTime.parse(stop.time);
                        return Builder(Stop)
                            .name(stop.name)
                            .time(time)
                            .position(stop.position)
                            .build();
                    }))
                    .build();
                backs.push(stopList);
            }

            // finally build the Line
            return Builder(Line)
                .id(line.id)
                .lineName(line.name)
                .adminEmail(line.admin_email)
                .outward(outwards)
                .back(backs)
                .build();
        })));
    }

    reservations(line: string, date): Observable<Reservations> {
        let api_url = "http://127.0.0.1:8080/reservations/" + line + "/" + date;
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
                            .name(c.name)
                            .present(c.present)
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
}
