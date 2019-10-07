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
import {map, mergeMap, toArray} from "rxjs/operators";
import {range} from "rxjs/internal/observable/range";
import {Line} from "../../models/line";
import {HttpClient} from "@angular/common/http";
import {Stop} from "../../models/stop";
import {collectExternalReferences} from "@angular/compiler";
import {AttendanceService} from "../attendance/attendance.service";
import {Role} from "../../models/authority";
import {of} from "rxjs/internal/observable/of";
import {from} from "rxjs/internal/observable/from";

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

  private todays_shift_subject: Subject<any[]> = new BehaviorSubject([]);
  todays_shifts$: Observable<any[]> = this.todays_shift_subject.asObservable();

  private currentStartDate: Date;
  private currentEndDate: Date;

  constructor(private lineService: AttendanceService, private auth: AuthService, private http: HttpClient) {
    this.auth.isLoggedIn$.subscribe((login) =>{
      if(login){
        this.updateCalendarShifts(new Date());
        this.buildUpcomingEvents();
        this.updateTodaysShifts();
      }
    });
  }

  /**
   * This method updates the subject to which calendar component refers to when rendering calendar events.
   * Shift retrieved are the assigned ones to current user, both closed and open shifts are retrieved.
   * @param {Date} startDate
   */
  updateCalendarShifts(startDate: Date){
    // take always the whole month.
    let start = LocalDate.of(startDate.getFullYear(), startDate.getMonth()+1, 1);
    // let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000+1, ZoneOffset.of());
    // backend compliant string
    let dateString =("0" + start.dayOfMonth()).slice(-2) +
      ("0" + start.monthValue()).slice(-2) +
      start.year();

    let uid = this.auth.getCurrentUser().id;
    this.http.get<any[]>(`${this.shift_url}/assigned/${dateString}/${uid}`).subscribe((retrieved_shifts)=>{
      let events = [];
      for(let s of retrieved_shifts){

        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = s.from;
        shift.to = s.to;
        shift.startsAt = LocalTime.parse(s.startsAt);
        shift.endsAt = LocalTime.parse(s.endsAt);
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

  /**
   * Upcoming events are those starting from the current day. The difference with updateCalendarShifts is in the Subject
   * type since this populates a Subject<Shift[]> rather than a Subject<any[]>.
   * What's more is that updateCalendarShifts considers always the first day of the month.
   * buildUpcoming event considers the current day.
   */
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

        console.log(s);
        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.startsAt = LocalTime.parse(s.startsAt);
        shift.endsAt = LocalTime.parse(s.endsAt);
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = s.from;
        shift.to = s.to;
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

  /**
   * This method is principally needed to handle localization timeouts. For the rest is equal to buildUpcomingEvents.
   */
  updateTodaysShifts(){
    let startDate = new Date();
    let start = LocalDate.of(startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate());
    // let start = LocalDateTime.ofEpochSecond(startDate.valueOf()/1000+1, ZoneOffset.of());
    // backend compliant string
    let dateString =("0" + start.dayOfMonth()).slice(-2) +
      ("0" + start.monthValue()).slice(-2) +
      start.year();

    let uid = this.auth.getCurrentUser().id;
    this.http.get<any[]>(`${this.shift_url}/by-date/${dateString}`).subscribe((retrieved_shifts)=>{
      let shifts = [];
      for(let s of retrieved_shifts){

        // shift has passed, no need to insert it.
        if(LocalTime.parse(s.endsAt).isBefore(LocalTime.now())) continue;

        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.startsAt = LocalTime.parse(s.startsAt);
        shift.endsAt = LocalTime.parse(s.endsAt);
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = s.from;
        shift.to = s.to;
        shift.availabilities = this.auth.getUsersDetails(s.availabilities);
        shift.companionId = s.companionId;
        shift.defaultCompanion = s.defaultCompanion;

        let color = this.getBackgroundColor(shift, s.lineName, s.availabilities);
        shift.color = color === Colors.GREEN?Colors.GREEN : Colors.BLUE;

        shifts.push(shift);
      }
      this.todays_shift_subject.next(shifts);
    });
  }

  getReservationToShiftMapping(reservationId: string){
    return this.http.get<string[]>(`${this.shift_url}/by-resid/${reservationId}`);
  }

  /**
   * This method retrieves all the shifts appearing in the db and build all the other possible ones from the lines
   * information. Everything is encapsulated in fullcalendar-compatible events
   * @param {Date} startDate
   * @param {Date} endDate
   */
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

        let shift = new Shift();
        let date = LocalDate.parse(s.date, DateTimeFormatter.ofPattern("d-M-yyyy"));
        shift.startsAt = LocalTime.parse(s.startsAt);
        shift.endsAt = LocalTime.parse(s.endsAt);
        shift.id = s.id;
        shift.date = date;
        shift.lineName = s.lineName;
        shift.direction = s.direction;
        shift.tripIndex = s.tripIndex;
        shift.open = s.open;
        shift.from = s.from;
        shift.to = s.to;
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
              console.log(line);
              let event = {};
              let new_shift;
              // create a shift for each ride
              for(let tripIndex in line.stops.stops[0].outward){
                new_shift = new Shift();
                new_shift.date = date;
                new_shift.lineName = line.name;
                new_shift.direction = "OUTWARD";
                new_shift.tripIndex = tripIndex;
                new_shift.startsAt = line.stops.startsAt[0][tripIndex];
                new_shift.endsAt = line.stops.endsAt[0][tripIndex];
                new_shift.from = line.stops.stops[0].name;
                new_shift.to = line.stops.stops[line.stops.stops.length-1].name;
                new_shift.defaultCompanion = line.adminEmail;

                // filter shifts finding all elements which are equal to new_shift. If any exists, don't add event.
                if (shifts.filter(elem => new_shift.compareTo(elem.shift)).length <= 0) {

                  new_shift.color = this.getBackgroundColor(new_shift, line.name);
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

              for(let tripIndex in line.stops.stops[0].back){
                new_shift = new Shift();
                new_shift.date = date;
                new_shift.lineName = line.name;
                new_shift.direction = "BACK";
                new_shift.tripIndex = tripIndex;
                new_shift.startsAt = line.stops.startsAt[1][tripIndex];
                new_shift.endsAt = line.stops.endsAt[1][tripIndex];
                new_shift.from = line.stops.stops[line.stops.stops.length-1].name;
                new_shift.to = line.stops.stops[0].name;
                new_shift.defaultCompanion = line.adminEmail;

                if (shifts.filter(elem => new_shift.compareTo(elem.shift)).length <= 0) {

                  new_shift.color = this.getBackgroundColor(new_shift, line.name);
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

  /**
   * Depending on the shift properties, it returns the event background color.
   * @param {Shift} shift
   * @param {string} lineName
   * @param {any[]} availabilities
   * @returns {string}
   */
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


  public getShiftsForReservation(resid: string): Observable<Shift[]>{
    return this.http.get<Shift[]>(`${this.shift_url}/by-resid/${resid}`);
  }


  /**
   * Uses getShiftForReservation (<- singualar!) and rxjs mapping operators to retrieve the shifts related to a bunch of reservations
   * @param {string[]} resids
   * @returns {Observable<Shift[]>}
   */
  public getShiftsForReservations(resids: string[]): Observable<any[]>{
    return from(resids)
      .pipe(
        mergeMap((resid) => this.getShiftsForReservation(resid)),
        toArray()
      )
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

  getTodaysShifts(): Observable<Shift[]>{
    return this.todays_shifts$;
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
    console.log(arrival_stop);
    let stop = null;
    let time = null;
    let coords = null;
    if(arrival_stop != null) {
      coords = {type: arrival_stop.position['type'], coordinates: arrival_stop.position['coordinates']};
      stop = arrival_stop.name;
      if(s.direction=='OUTWARD'){
        time = arrival_stop.outward[s.tripIndex];
      }else{
        time = arrival_stop.back[s.tripIndex];
      }
    }

    let body = {
      shiftId: s.id,
      date:s.date,
      lineName: s.lineName,
      direction:s.direction,
      tripIndex: s.tripIndex,
      assignedCompanionEmail: assigned_user,
      to: stop,
      position: coords,
      endsAt: time
    };
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
