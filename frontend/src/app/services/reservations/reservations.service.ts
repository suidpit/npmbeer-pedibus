import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Line} from '../../models/line';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators'
import {Reservations} from "../../models/reservations";
import {Child} from "../../models/child";
import {Builder} from "builder-pattern";
import {StopList} from "../../models/stop-list";
import {LocalTime} from "js-joda";
import {Stop} from "../../models/stop";
import {Reservation} from "../../models/reservation";
import {ILine} from "../../models/iline";
import {AuthService} from "../auth/auth.service";
import {ReservationReq} from "../../models/reservation-req";
import {stringify} from "querystring";

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {

    private lines: Line[] = [];
    private baseUrl: String = 'http://localhost:8080'

    constructor(private http: HttpClient, private autService: AuthService) {
    } // using Angular Dependency Injection

    getLines(): Observable<Line[]> {
        return this.http.get<Line[]>(this.baseUrl + "/lines").pipe(map((data) => {
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


    children(): Observable<Child[]> {
        let children = [];
        children.push("Alessandra");
        children.push("Francesca");
        children.push("Michele");
        return of(children);
    }

    reserve(line: String, date: String, children: String[], stop: String, direction: String, tripIndex: number): Observable<any> {
        const reservation = Builder(ReservationReq)
            .stopName(stop)
            .child(children)
            .direction(direction.toUpperCase())
            .tripIndex(tripIndex)
            .build();
        return this.http.post(this.baseUrl + "/reservations/user/" + line + "/" + date, JSON.stringify(reservation));
    }

    selected_stop_observer$: Subject<any> = new BehaviorSubject(undefined);

    closePopup() {
        this.selected_stop_observer$.next(undefined);
    }

    selectStop(s) {
        this.selected_stop_observer$.next(s);
    }
}
