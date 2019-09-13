import { Injectable } from '@angular/core';
import {DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, ZoneOffset} from "js-joda";
import * as joda from "js-joda";
import {Shift} from "../../models/shift";
import {Subject} from "rxjs/internal/Subject";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import { ReservationsService } from "../reservations/reservations.service";
import {AuthService} from "../auth/auth.service";
import {Colors} from "../../utils/colors";
import {map, toArray} from "rxjs/operators";
import {range} from "rxjs/internal/observable/range";
import {Line} from "../../models/line";
import {HttpClient} from "@angular/common/http";
import {Stop} from "../../models/stop";

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  shifts = [];
  events = [];

  shift_url = "http://localhost:8080/admin/shifts";
  availabilty_url = "http://localhost:8080/admin/shifts/availability";
  availability_template = {
    date: "",
    shiftId: "",
    lineName: "",
    direction: "",
    tripIndex: 0
  };

  line_names = ["Linea 1", "Linea 2", "E-Line 1"];
  directions = ["BACK", "OUTWARD"];

  private shifts_subject: Subject<Shift[]> = new BehaviorSubject([]);
  shifts$: Observable<Shift[]> = this.shifts_subject.asObservable();

  private calendar_shifts_subject: Subject<any[]> = new BehaviorSubject([]);
  calendar_shifts$ : Observable<any[]> = this.calendar_shifts_subject.asObservable();

  private availabilities_subject: Subject<any[]> = new BehaviorSubject([]);
  availabilities$: Observable<any[]> = this.availabilities_subject.asObservable();

  constructor(private lineService: ReservationsService, private auth: AuthService, private http: HttpClient) {
    for(let j = 0; j < 10; j++){
      let shift = new Shift();

      let i = this.randomIntFromInterval(0,7);
      let dt = LocalDateTime.now();

      dt = dt.plusDays(i);

      shift.dateAndTime = dt;
      shift.companionId = this.auth.getCurrentUser().id;
      shift.availabilities =[this.auth.getCurrentUser().id];
      shift.open = false;

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

  // TODO implement end date.
  buildShifts(startDate: Date, endDate: Date){
    let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000, ZoneOffset.UTC);

    // backend compliant string
    let dateString =("0" + start.dayOfMonth()).slice(-2) +
      ("0" + start.monthValue()).slice(-2) +
      start.year();

    this.http.get(this.shift_url+"/"+dateString).subscribe((retrieved_shifts) => {
      let shifts = [];
      for(let s of retrieved_shifts){
        let from = new Stop();
        from.position = s.from.position;
        from.time = s.from.time;
        from.name = s.from.name;

        let to = new Stop();
        to.position = s.to.position;
        to.time = s.to.time;
        to.name = s.to.name;

        let shift = new Shift();
        let date = LocalDateTime.of(LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy")), LocalTime.of(0, 0, 0));
        shift.dateAndTime = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = from;
        shift.to = to;
        shift.startsAt = from.time;
        shift.endsAt = to.time;

        let dateString = date.year() +
          "-" + ("0" + date.monthValue()).slice(-2) +
          "-" + ("0" + date.dayOfMonth()).slice(-2);

        let event = {
          date: dateString,
          title: shift.startsAt.toString() + " - " + shift.endsAt.toString() + " " + shift.lineName + " " + shift.direction,
          shift: shift
        };

        shifts.push(event);
      }

      this.lineService.lines().pipe(
        map(line_list => {
          for (let i of Array(7).keys()) {
            let date = start.plusDays(i);
            let dateString = date.year() +
              "-" + ("0" + date.monthValue()).slice(-2) +
              "-" + ("0" + date.dayOfMonth()).slice(-2);
            for (let line of line_list) {
              let event = {};
              let s;

              // create a shift for each ride
              for(let tripIndex in line.outward){
                s = new Shift();
                s.dateAndTime = date;
                s.lineName = line.lineName;
                s.direction = "OUTWARD";
                s.tripIndex = tripIndex;
                s.startsAt = line.outward[tripIndex].startsAt;
                s.endsAt = line.outward[tripIndex].endsAt;
                s.from = line.outward[tripIndex].stops[0];
                s.to = line.outward[tripIndex].stops[line.outward[tripIndex].stops.length - 1];

                // finds the index of the first element satisfying the passed callback criterion, otherwise -1
                // in this case we don't want to add a shift if there was one with the same specifications already
                if (shifts.findIndex(s.compareTo) === -1) {
                  event = {
                    date: dateString,
                    title: s.startsAt.toString() + " - " + s.endsAt.toString() + " " + s.lineName + " " + s.direction,
                    shift: s
                  };

                  shifts.push(event);
                }
              }

              for(let tripIndex in line.back){
                s = new Shift();
                s.dateAndTime = date;
                s.lineName = line.lineName;
                s.direction = "BACK";
                s.tripIndex = tripIndex;
                s.startsAt = line.back[tripIndex].startsAt;
                s.endsAt = line.back[tripIndex].endsAt;
                s.from = line.back[tripIndex].stops[0];
                s.to = line.back[tripIndex].stops[line.back[tripIndex].stops.length - 1];

                if (shifts.findIndex(s.compareTo) === -1) {
                  event = {
                    date: dateString,
                    title: s.startsAt.toString() + " - " + s.endsAt.toString() + " " + s.lineName + " " + s.direction,
                    shift: s
                  };

                  shifts.push(event);
                }
              }
            }
          }
        })
      );
    });

    this.lineService.lines().pipe(
      map(line_list =>{
        let shifts = [];
        for(let i of Array(7).keys()){
          let date = start.plusDays(i);
          let dateString = date.year() +
            "-" + ("0" + date.monthValue()).slice(-2) +
            "-" + ("0" + date.dayOfMonth()).slice(-2);
          for(let line of line_list){
            let event = {};

            let s = new Shift();
            s.dateAndTime = date;
            s.lineName = line.lineName;
            s.direction = "OUTWARD";
            s.startsAt = line.back[0].startsAt;
            s.endsAt = line.back[0].endsAt;
            s.from = line.back[0].stops[0];
            s.to = line.back[0].stops[line.back[0].stops.length-1];

            event = {
              date: dateString,
              title: s.startsAt.toString() + " - " + s.endsAt.toString() + " " + s.lineName + " OUTWARD",
              shift: s
            };

            shifts.push(event);

            s = new Shift();
            s.dateAndTime = date;
            s.lineName = line.lineName;
            s.direction = "BACK";
            s.startsAt = line.back[0].startsAt;
            s.endsAt = line.back[0].endsAt;
            s.from = line.back[0].stops[0];
            s.to = line.back[0].stops[line.back[0].stops.length-1];

            event = {
              date: dateString,
              title: s.startsAt.toString() + " - " + s.endsAt.toString() + " " + s.lineName + " BACK",
              shift: s
            };

            shifts.push(event);
          }
        }
        return shifts;
      })
    ).subscribe((shifts) => this.availabilities_subject.next(shifts));
  }

  updateAvailabilties(startDate: Date, endDate: Date){
    this.lineService.lines().subscribe((lines) => console.log(lines));
    let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000, ZoneOffset.UTC);
    let end = LocalDateTime.ofEpochSecond(endDate.valueOf()/1000, ZoneOffset.UTC);
    let avail = [];
    let avail_events = [];
    for(let j = 0; j < 10; j++){
      let shift = new Shift();

      let i = this.randomIntFromInterval(0,7);

      let dt = start;
      dt = dt.plusDays(i);

      shift.dateAndTime = dt;

      i = this.randomIntFromInterval(0,1);
      let flag = i===0;
      if(flag){
        shift.availabilities = [this.auth.getCurrentUser().id];
        i = this.randomIntFromInterval(0,1);
        flag = i===0;
        shift.companionId = flag?this.auth.getCurrentUser().id:"";
        i = this.randomIntFromInterval(0,1);
        flag = i===0;
        shift.open = flag;
      }
      else{
        shift.availabilities = [];
        shift.companionId = "";
        shift.open = true;
      }

      let color = "";
      if(!shift.open){
        color = Colors.GREEN;
      }
      else{
        if(shift.companionId !== ""){
          color = Colors.BLUE;
        }
        else{
          if(shift.availabilities.length > 0){
            color = Colors.YELLOW;
          }
          else{
            color = Colors.RED;
          }
        }
      }

      if(shift.availabilities.indexOf(this.auth.getCurrentUser().id) !== -1){
        shift.classNames = ["black-border"];
      }
      else shift.classNames = ["white-border"];

      shift.color = color;

      i = this.randomIntFromInterval(0,1);
      flag = i===0;
      shift.availabilities = [flag?this.auth.getCurrentUser():null];

      if(shift.availabilities.length)
      i = this.randomIntFromInterval(0,2);
      shift.lineName = this.line_names[i];

      i = this.randomIntFromInterval(0,1);
      shift.direction = this.directions[i];
      avail.push(shift);
    }

    avail.sort((a, b) => a.dateAndTime.isBefore(b.dateAndTime)? -1:+1);
    for(let s of avail) {
      let title = "";
      title += ("0" + s.dateAndTime.hour()).slice(-2) + ":" + ("0" + s.dateAndTime.minute()).slice(-2);
      title += " " + s.lineName + " " + s.direction;
      let date = s.dateAndTime.year() +
        "-" + ("0" + s.dateAndTime.monthValue()).slice(-2) +
        "-" + ("0" + s.dateAndTime.dayOfMonth()).slice(-2);
      avail_events.push({
        title: title,
        date: date,
        color: s.color,
        classNames: s.classNames,
        shift: s
      });
    }
    this.availabilities_subject.next(avail_events);
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

  getAvailabilities(): Observable<any[]>{
    return this.availabilities$;
  }

  sendShiftAvailability(s: Shift){
    this.http.post(this.availabilty_url,
      [{shiftId: s.id, date:s.dateAndTime.toLocalDate(), lineName: s.lineName, direction:s.direction, tripIndex: 0}])
      .subscribe((result) => console.log(result));
  }
}
