import { Injectable } from '@angular/core';
import {LocalDateTime} from "js-joda";
import {Shift} from "../../models/shift";
import {Subject} from "rxjs/internal/Subject";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {ReservationsService} from "../../reservations.service";

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  shifts = [];
  events = [];

  line_names = ["Linea 1", "Linea 2", "E-Line 1"];
  directions = ["BACK", "OUTWARD"];

  private shifts_subject: Subject<Shift[]> = new BehaviorSubject([]);
  shifts$: Observable<Shift[]> = this.shifts_subject.asObservable();

  private calendar_shifts_subject: Subject<any[]> = new BehaviorSubject([]);
  calendar_shifts$ : Observable<any[]> = this.calendar_shifts_subject.asObservable();

  constructor(private lineService: ReservationsService) {
    for(let j = 0; j < 10; j++){
      let shift = new Shift();

      let i = this.randomIntFromInterval(0,7);
      let dt = LocalDateTime.now();

      dt = dt.plusDays(i);

      shift.dateAndTime = dt;

      i = this.randomIntFromInterval(0,2);
      shift.lineName = this.line_names[i];

      i = this.randomIntFromInterval(0,1);
      shift.direction = this.directions[i];
      this.shifts.push(shift);
    }

    this.shifts.sort((a, b) => a.dateAndTime.isBefore(b.dateAndTime)? -1:+1);
    for(let s of this.shifts) {
      let title = "";
      title += ("0" + s.dateAndTime.hour()).slice(-2) + ":" + ("0" + s.dateAndTime.minute()).slice(-2);
      title += " " + s.lineName + " " + s.direction;
      let date = s.dateAndTime.year() +
        "-" + ("0" + s.dateAndTime.monthValue()).slice(-2) +
        "-" + ("0" + s.dateAndTime.dayOfMonth()).slice(-2);
      this.events.push({
        title: title,
        date: date
      });
    }

    this.shifts_subject.next(this.shifts);
    this.calendar_shifts_subject.next(this.events);
  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getCalendarShifts(): Observable<any[]>{
    return this.calendar_shifts$;
  }

  getShifts(): Observable<Shift[]>{
    return this.shifts$;
  }
}
