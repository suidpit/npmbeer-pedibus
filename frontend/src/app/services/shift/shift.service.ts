import { Injectable } from '@angular/core';
import {DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, ZoneId, ZoneOffset} from "js-joda";
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
import {collectExternalReferences} from "@angular/compiler";
import {AttendanceService} from "../attendance/attendance.service";
import {Role} from "../../models/authority";
import {of} from "rxjs/internal/observable/of";

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

  private currentStartDate: Date;
  private currentEndDate: Date;

  constructor(private lineService: AttendanceService, private auth: AuthService, private http: HttpClient) {
    this.updateCalendarShifts(new Date());
    this.buildUpcomingEvents();
  }

  updateCalendarShifts(startDate: Date){
    let start = LocalDate.of(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate());
    // let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000+1, ZoneOffset.of());
    // backend compliant string
    let dateString =("0" + start.dayOfMonth()).slice(-2) +
      ("0" + start.monthValue()).slice(-2) +
      start.year();

    let uid = this.auth.getCurrentUser().id;
    this.http.get<any[]>(`${this.shift_url}/assigned/${dateString}/${uid}`).subscribe((retrieved_shifts)=>{
      let events = [];
      for(let s of retrieved_shifts){
        let from = new Stop();
        from.position = s.from.position;
        from.time = LocalTime.parse(s.from.time);
        from.name = s.from.name;

        let to = new Stop();
        to.position = s.to.position;
        to.time = LocalTime.parse(s.to.time);
        to.name = s.to.name;

        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = from;
        shift.to = to;
        shift.startsAt = from.time;
        shift.endsAt = to.time;
        shift.availabilities = this.auth.getUsersDetails(s.availabilities);
        shift.companionId = s.companionId;
        shift.defaultCompanion = s.defaultCompanion;

        let color = this.getBackgroundColor(shift, s.lineName, s.availabilities);
        shift.color = color === Colors.GREEN?Colors.GREEN : Colors.BLUE;

        let dateString = date.year() +
          "-" + ("0" + date.monthValue()).slice(-2) +
          "-" + ("0" + date.dayOfMonth()).slice(-2);

        let event = {
          date: dateString,
          title: shift.startsAt.toString() + " - " + shift.endsAt.toString() + " " + shift.lineName + " " + shift.direction,
          shift: shift,
          color: shift.color
        };
        events.push(event);
      }
      this.calendar_shifts_subject.next(events);
    });
  }

  buildUpcomingEvents(){
    let startDate = new Date();
    let start = LocalDate.of(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate());
    // let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000+1, ZoneOffset.of());
    // backend compliant string
    let dateString =("0" + start.dayOfMonth()).slice(-2) +
      ("0" + start.monthValue()).slice(-2) +
      start.year();

    let uid = this.auth.getCurrentUser().id;
    this.http.get<any[]>(`${this.shift_url}/assigned/${dateString}/${uid}`).subscribe((retrieved_shifts)=>{
      let shifts = [];
      for(let s of retrieved_shifts){
        let from = new Stop();
        from.position = s.from.position;
        from.time = LocalTime.parse(s.from.time);
        from.name = s.from.name;

        let to = new Stop();
        to.position = s.to.position;
        to.time = LocalTime.parse(s.to.time);
        to.name = s.to.name;

        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = from;
        shift.to = to;
        shift.startsAt = from.time;
        shift.endsAt = to.time;
        shift.availabilities = this.auth.getUsersDetails(s.availabilities);
        shift.companionId = s.companionId;
        shift.defaultCompanion = s.defaultCompanion;

        let color = this.getBackgroundColor(shift, s.lineName, s.availabilities);
        shift.color = color === Colors.GREEN?Colors.GREEN : Colors.BLUE;

        shifts.push(shift);
      }
      this.shifts_subject.next(shifts);
    });
  }

  // TODO implement end date.
  buildShifts(startDate: Date=null, endDate: Date=null){

    if(startDate === null) startDate = this.currentStartDate;
    else this.currentStartDate = startDate;
    if(endDate === null) endDate = this.currentEndDate;
    else this.currentEndDate = endDate;

    let start = LocalDate.of(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate());
    // let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000+1, ZoneOffset.of());
    // backend compliant string
    let dateString =("0" + start.dayOfMonth()).slice(-2) +
      ("0" + start.monthValue()).slice(-2) +
      start.year();

    this.http.get<any[]>(this.shift_url+"/"+dateString).subscribe((retrieved_shifts) => {
      let shifts = [];
      for(let s of retrieved_shifts){
        let from = new Stop();
        from.position = s.from.position;
        from.time = LocalTime.parse(s.from.time);
        from.name = s.from.name;

        let to = new Stop();
        to.position = s.to.position;
        to.time = LocalTime.parse(s.to.time);
        to.name = s.to.name;

        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = from;
        shift.to = to;
        shift.startsAt = from.time;
        shift.endsAt = to.time;
        shift.availabilities = this.auth.getUsersDetails(s.availabilities);
        shift.companionId = s.companionId;
        shift.defaultCompanion = s.defaultCompanion;

        let color = this.getBackgroundColor(shift, s.lineName, s.availabilities);
        shift.color = color;
        shift.disabled = color === Colors.GRAY;

        // black border if user had expressed availability for this shift.
        if(!shift.disabled && s.availabilities && s.availabilities.indexOf(this.auth.getCurrentUser().id) !== -1){
          shift.classNames = ["black-border"];
          shift.subscribed = true;
        }
        else shift.classNames = ["white-border"];


        let dateString = date.year() +
          "-" + ("0" + date.monthValue()).slice(-2) +
          "-" + ("0" + date.dayOfMonth()).slice(-2);

        let event = {
          date: dateString,
          title: shift.startsAt.toString() + " - " + shift.endsAt.toString() + " " + shift.lineName + " " + shift.direction,
          shift: shift,
          color: shift.color,
          classNames: shift.classNames,
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
              let new_shift;
              // create a shift for each ride
              for(let tripIndex in line.outward){
                new_shift = new Shift();
                new_shift.date = date;
                new_shift.lineName = line.lineName;
                new_shift.direction = "OUTWARD";
                new_shift.tripIndex = tripIndex;
                new_shift.startsAt = line.outward[tripIndex].startsAt;
                new_shift.endsAt = line.outward[tripIndex].endsAt;
                new_shift.from = line.outward[tripIndex].stops[0];
                new_shift.to = line.outward[tripIndex].stops[line.outward[tripIndex].stops.length - 1];
                new_shift.defaultCompanion = line.adminEmail;

                // filter shifts finding all elements which are equal to new_shift. If any exists, don't add event.
                if (shifts.filter(elem => new_shift.compareTo(elem.shift)).length <= 0) {

                  new_shift.color = this.getBackgroundColor(new_shift, line.lineName);
                  new_shift.classNames = ["white-border"];
                  new_shift.disabled = new_shift.color === Colors.GRAY;

                  event = {
                    date: dateString,
                    title: new_shift.startsAt.toString() + " - " + new_shift.endsAt.toString() + " " + new_shift.lineName + " " + new_shift.direction,
                    shift: new_shift,
                    color: new_shift.color,
                    classNames: new_shift.classNames
                  };

                  shifts.push(event);
                }
              }

              for(let tripIndex in line.back){
                new_shift = new Shift();
                new_shift.date = date;
                new_shift.lineName = line.lineName;
                new_shift.direction = "BACK";
                new_shift.tripIndex = tripIndex;
                new_shift.startsAt = line.back[tripIndex].startsAt;
                new_shift.endsAt = line.back[tripIndex].endsAt;
                new_shift.from = line.back[tripIndex].stops[0];
                new_shift.to = line.back[tripIndex].stops[line.back[tripIndex].stops.length - 1];
                new_shift.defaultCompanion = line.adminEmail;

                if (shifts.filter(elem => new_shift.compareTo(elem.shift)).length <= 0) {

                  new_shift.color = this.getBackgroundColor(new_shift, line.lineName);
                  new_shift.classNames = ["white-border"];
                  new_shift.disabled = new_shift.color === Colors.GRAY;

                  event = {
                    date: dateString,
                    title: new_shift.startsAt.toString() + " - " + new_shift.endsAt.toString() + " " + new_shift.lineName + " " + new_shift.direction,
                    shift: new_shift,
                    color: new_shift.color,
                    classNames: new_shift.classNames
                  };

                  shifts.push(event);
                }
              }
            }
          }
          return shifts;
        })
      ).subscribe((shifts) => this.availabilities_subject.next(shifts));
    });
  }

  private getBackgroundColor(shift: Shift, lineName: string, availabilities = []){
    let color = "";
    if(shift.date.isBefore(LocalDate.now(ZoneId.of("+01:00"))) || shift.date.isEqual(LocalDate.now(ZoneId.of("+01:00")))){
      // Old shifts are not to be expresses availabilities for.
      color = Colors.GRAY;
    }
    else if(!shift.open){
      // Closed shift, no need to express availability, but still can if anyone wants.
      color = Colors.GREEN;
    }
    else if(this.auth.getCurrentUser().hasAuthorityOnLine(shift.lineName)){
      if (shift.companionId !== "" && shift.companionId !== null && shift.companionId !== undefined) {
        color = Colors.DARK_BLUE;
      }
      else {
        if (availabilities.length > 0) {
          color = Colors.YELLOW;
        }
        else {
          color = Colors.RED;
        }
      }
    }
    return color;
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
    let body = {shiftId: s.id, date:s.date, lineName: s.lineName, direction:s.direction, tripIndex: s.tripIndex};
    return this.http.post(this.availabilty_url, [body]);
  }

  cancelShiftAvailability(s: Shift){
    if(s.id === null || s.id === undefined || s.id === ""){
      console.error("Invalid Shift to cancel availability from.");
      return;
    }
    let body = {shiftId: s.id, date:s.date, lineName: s.lineName, direction:s.direction, tripIndex: s.tripIndex};
    return this.http.post(`${this.shift_url}/cancel_availability`, body);
  }

  sendShiftAssignment(s: Shift, assigned_user: string, arrival_stop: Stop){
    let stop = {};
    if(arrival_stop != null) {
      let coords = {type: arrival_stop.position['type'], coordinates: arrival_stop.position['coordinates']};
      stop = {name: arrival_stop.name, position: coords, time: arrival_stop.time};
    }

    let body = {
      shiftId: s.id,
      date:s.date,
      lineName: s.lineName,
      direction:s.direction,
      tripIndex: s.tripIndex,
      assignedCompanionEmail: assigned_user,
      to: stop};
    console.log(body);
    return this.http.post(`${this.shift_url}/confirm`, body);
  }

  sendOpenCloseShifts(shifts: Shift[]){
    let body = [];
    for(let s of shifts){
      body.push({shiftId: s.id, open: s.open});
    }
    return this.http.post(`${this.shift_url}/toggle-open`, body);
  }
}
