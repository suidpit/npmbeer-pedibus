import {Injectable, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Line} from '../../models/line';
import {HttpClient} from '@angular/common/http';
import {map, take} from 'rxjs/operators'
import {Child} from "../../models/child";
import {Builder} from "builder-pattern";
import {ReservationReq} from "../../models/reservation-req";
import {DateTimeFormatter, LocalDate, LocalTime, ZoneId} from "js-joda";
import {Reservation} from "../../models/reservation";
import {ProfileService} from "../profile/profile.service";
import {AuthService} from "../auth/auth.service";
import {IChildReservationInfo} from "../../models/ichild-reservation-info";
import {max} from "moment";
import {Local} from "protractor/built/driverProviders";

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {

    private baseUrl: String = 'http://localhost:8080';
    selected_stop_observer$: Subject<any> = new BehaviorSubject(undefined);

    private reservations_subject: Subject<any[]> = new BehaviorSubject([]);
    reservations$: Observable<any[]> = this.reservations_subject.asObservable();

    defaultStop = undefined;
    defaultLine = undefined;
    lines: Line[] = [];

    constructor(private http: HttpClient, private profileService: ProfileService, private auth: AuthService) {
        profileService.user$.subscribe((user) => {
            if (user != null) {
                this.defaultLine = user.defaultLine;
                this.defaultStop = user.defaultStop;
            }
        });

        this.getLines().pipe(take(1)).subscribe((lines) => {
            this.lines = lines;
        })
    } // using Angular Dependency Injection

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

    reserveDefault(date: string, child: string, direction: string, today: boolean): Observable<any> {
        let stop = this.defaultStop;
        let line = this.defaultLine;
        let tripIndex = 0;
        let times: LocalTime[] = [];
        console.log(today);
        if(today) {
            if (direction == 'OUTWARD')
                times = this.lines.filter(value => value.name === line)[0].stops.stops
                    .filter(value => value.name === stop)[0].outward;
            else
                times = this.lines.filter(value => value.name === line)[0].stops.stops
                    .filter(value => value.name === stop)[0].back;

            for (let i = 0; i < times.length; i++) {
                if (times[i].isAfter(LocalTime.now())) {
                    tripIndex = i;
                    break;
                }
            }
        }

        const reservation = Builder(ReservationReq)
            .stopName(stop)
            .child(child)
            .direction(direction.toUpperCase())
            .tripIndex(tripIndex)
            .build();
        return this.http.post(this.baseUrl + "/reservations/user/" + line + "/" + date, JSON.stringify(reservation));
    }

    reserve(line: String, date: String, child: String, stop: String, direction: String, tripIndex: number): Observable<any> {
        const reservation = Builder(ReservationReq)
            .stopName(stop)
            .child(child)
            .direction(direction.toUpperCase())
            .tripIndex(tripIndex)
            .build();
        return this.http.post(this.baseUrl + "/reservations/user/" + line + "/" + date, JSON.stringify(reservation));

    }

    closePopup() {
        this.selected_stop_observer$.next(undefined);
    }

    selectStop(s) {
        this.selected_stop_observer$.next(s);
    }

    unsubscribe() {
        this.selected_stop_observer$.next(undefined);
    }

    buildReservations(startDate: Date, selectedChild) {
        if (startDate == null) startDate = new Date();
        let start = LocalDate.of(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        let dateString = ("0" + start.dayOfMonth()).slice(-2) +
            ("0" + start.monthValue()).slice(-2) +
            start.year();
        this.http.get<any[]>(this.baseUrl + "/reservations/user/" + selectedChild + "/from/" + dateString).subscribe((retrieved_reservations) => {
            let events = [];
            for (let s of retrieved_reservations) {
                let reservation = new Reservation();
                reservation.stopName = s.stopName;
                reservation.date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                reservation.direction = s.direction;
                reservation.tripIndex = s.tripIndex;
                reservation.lineName = s.lineName;
                reservation.id = s.id;
                reservation.childId = selectedChild;

                reservation.booked = true;
                let dateString = reservation.date.year() +
                    "-" + ("0" + reservation.date.monthValue()).slice(-2) +
                    "-" + ("0" + reservation.date.dayOfMonth()).slice(-2);

                let temp_stop = this.lines.filter((value) => value.name === reservation.lineName)[0]
                    .stops.stops.filter((value => value.name == reservation.stopName))[0];
                let time: LocalTime = null;
                if (reservation.direction == 'OUTWARD') {
                    time = temp_stop.outward[reservation.tripIndex];
                } else {
                    time = temp_stop.back[reservation.tripIndex];
                }

                if (reservation.date.isBefore(LocalDate.now()) ||
                    (reservation.date.isEqual(LocalDate.now()) && time.isBefore(LocalTime.now())))
                    reservation.color = 'GRAY';
                else
                    reservation.color = 'BLUE';

                let event = {
                    start: new Date(reservation.date.year(), reservation.date.monthValue() - 1, reservation.date.dayOfMonth(), 0, 0),
                    end: new Date(reservation.date.year(), reservation.date.monthValue() - 1, reservation.date.dayOfMonth(), 12, 0),
                    allDay: true,
                    time: time,
                    meta: {
                        reservation: reservation,
                    },
                    color: reservation.color,
                };
                events.push(event);
            }
            for (let i of Array(7).keys()) {
                let date = start.plusDays(i);

                // create a reservation for each missing day and back/out
                let event1 = this.createReservation(date, 'OUTWARD', events, selectedChild)

                if (event1 != null) {
                    events.push(event1)
                }
                let event2 = this.createReservation(date, 'BACK', events, selectedChild);

                if (event2 != null) {
                    events.push(event2)
                }

            }
            this.reservations_subject.next(events);
        })
    }

    private createReservation(date, direction, events, selected_child) {
        let dateString = date.year() +
            "-" + ("0" + date.monthValue()).slice(-2) +
            "-" + ("0" + date.dayOfMonth()).slice(-2);
        let event = {};
        let new_reservation = null;

        new_reservation = new Reservation();
        new_reservation.date = date;
        new_reservation.direction = direction;
        new_reservation.tripIndex = 0;
        new_reservation.booked = false;
        new_reservation.childId = selected_child;

        // filter reservations to understand if needed adding a new one.
        if (events.filter(elem => (elem.meta.reservation.date.monthValue() == new_reservation.date.monthValue() &&
            elem.meta.reservation.date.dayOfMonth() == new_reservation.date.dayOfMonth() &&
            elem.meta.reservation.date.year() == new_reservation.date.year() &&
            elem.meta.reservation.direction == new_reservation.direction)).length == 0) {

            if (new_reservation.date.isBefore(LocalDate.now()))
                new_reservation.color = 'GRAY';
            else {
                let time_stop_default = LocalTime.of(0, 0, 0);
                if(this.defaultStop!=null) {
                    let stop = this.lines.filter((value) => value.name === this.defaultLine)[0]
                        .stops.stops.filter((value => value.name == this.defaultStop))[0];
                    if (direction == "OUTWARD")
                        for (let time of stop.outward) {
                            if (time_stop_default.isBefore(time)) {
                                time_stop_default = time;
                            }
                        }
                    else
                        for (let time of stop.back) {
                            if (time_stop_default.isBefore(time)) {
                                time_stop_default = time;
                            }
                        }
                }
                let time_stop_final: LocalTime = null;
                if (direction == "OUTWARD") {
                    time_stop_final = LocalTime.of(0, 0, 0);
                    for (let line of this.lines) {
                        for (let time of line.stops.stops[line.stops.stops.length - 1].outward) {
                            if (time_stop_final.isBefore(time))
                                time_stop_final = time;
                        }
                    }
                } else {
                    time_stop_final = LocalTime.of(0, 0, 0);
                    for (let line of this.lines) {
                        for (let time of line.stops.stops[0].back) {
                            if (time_stop_final.isBefore(time))
                                time_stop_final = time;
                        }
                    }
                }
                if (new_reservation.date.isEqual(LocalDate.now()) && time_stop_final.isBefore(LocalTime.now()))
                    new_reservation.color = 'GRAY';
                else {
                    new_reservation.color = 'RED';
                    new_reservation.default_stop_time = time_stop_default;
                }
            }


            event = {
                start: new Date(date.year(), date.monthValue() - 1, date.dayOfMonth(), 0, 0),
                end: new Date(date.year(), date.monthValue() - 1, date.dayOfMonth(), 12, 0),
                allDay: true,
                meta: {
                    reservation: new_reservation,
                },
                color: new_reservation.color,
            };

            return event;
        }
        return null;
    }

    getReservations(): Observable<any[]> {
        return this.reservations$;
    }

    removeReservation(reservation: Reservation) {
        let dateString = ("0" + reservation.date.dayOfMonth()).slice(-2) +
            ("0" + reservation.date.monthValue()).slice(-2) +
            reservation.date.year();
        return this.http.delete(this.baseUrl + "/reservations/user/" + reservation.lineName + "/" + dateString + "/" + reservation.id);
    }

    updateReservation(line: string, date: string, stop: string, index: number, reservation: Reservation) {
        let req = Builder(ReservationReq)
            .tripIndex(index)
            .stopName(stop)
            .lineName(line)
            .build();
        return this.http.put(this.baseUrl + "/reservations/user/" + reservation.lineName + "/" + date + "/" + reservation.id, req);
    }
}
