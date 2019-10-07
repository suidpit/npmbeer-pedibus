import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Line} from '../../models/line';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators'
import {Child} from "../../models/child";
import {Builder} from "builder-pattern";
import {ReservationReq} from "../../models/reservation-req";

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {

    private baseUrl: String = 'http://localhost:8080';

    constructor(private http: HttpClient) {} // using Angular Dependency Injection

    getLines(): Observable<Line[]> {
        return this.http.get<Line[]>(this.baseUrl + "/lines").pipe(map((data) => {
            return data.map((line) => {
                return new Line(line);
            });
        }));
    }

    children(): Observable<Child[]> {
        return this.http.get<Child[]>(this.baseUrl + "/profile/children");
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

    unsubscribe() {
        this.selected_stop_observer$.next(undefined);
    }
}
