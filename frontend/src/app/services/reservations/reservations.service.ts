import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Line} from '../../models/line';
import {HttpClient} from '@angular/common/http';
import {last, map, tap} from 'rxjs/operators'
import {Reservations} from "../../models/reservations";
import {Child} from "../../models/child";
import {Builder} from "builder-pattern";
import {StopList} from "../../models/stop-list";
import {LocalTime} from "js-joda";
import {Stop} from "../../models/stop";
import {Reservation} from "../../models/reservation";

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {

    constructor(private http: HttpClient) {
    }

    lines(): Observable<Line[]> {
        return this.http.get<any[]>("../../../assets/data/line.json").pipe(map((data) => data.map((line) => {
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

    children(): Observable<Child[]> {
        let children = [];
        children.push("Alessandra");
        children.push("Michele");
        return of(children);
    }

    selected_stop_observer$: Subject<any> = new BehaviorSubject(undefined);

    selectStop(s) {
        this.selected_stop_observer$.next(s);
    }
}
