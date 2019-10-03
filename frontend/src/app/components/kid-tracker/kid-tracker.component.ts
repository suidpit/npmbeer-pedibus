import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";
import {AuthService} from "../../services/auth/auth.service";
import {LocalizationService} from "../../services/localization/localization.service";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {IGeoJsonObject} from "../../models/igeojson-object";
import {Observable} from "rxjs/internal/Observable";
import {AttendanceService} from "../../services/attendance/attendance.service";
import {ProfileService} from "../../services/profile/profile.service";
import {childOfKind} from "tslint";
import {ShiftService} from "../../services/shift/shift.service";
import {take, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/index";
import {DateTimeFormatter, LocalTime} from "js-joda";
import {Shift} from "../../models/shift";

@Component({
  selector: 'app-kid-tracker',
  templateUrl: './kid-tracker.component.html',
  styleUrls: ['./kid-tracker.component.scss']
})
export class KidTrackerComponent implements OnInit, OnDestroy {

  geoloc_subject = new BehaviorSubject<IGeoJsonObject>(null);
  geolocalization$ = this.geoloc_subject.asObservable();
  stompClient;
  reservationsByChild;

  kiddo;

  error = undefined;

  timeout_handle;
  currentShiftId;
  noLine = "[Nessuna Linea]";
  noDirection = undefined;

  currentLineName = this.noLine;
  currentDirection = this.noDirection;

  stompSubscription;

  private unsubscribe$ = new Subject<void>();

  constructor(public auth: AuthService,
              public localizationService: LocalizationService,
              public shiftService: ShiftService,
              public profileService: ProfileService,
              private attendanceService: AttendanceService) {

    this.stompClient = localizationService.getStompClient();
    let headers = localizationService.getAuthenticationHeaders();

    let self = this;

    let today = new Date();
    let dd = ("0" + today.getDate()).slice(-1);
    let MM = ("0" + (today.getMonth()+1)).slice(-1);
    let yyyy = today.getFullYear();

    this.attendanceService.todayReservations().subscribe((reservations) =>{
        if(reservations && reservations.length > 0){
          self.error = undefined;
          this.reservationsByChild = {};
          for(let res of reservations){
            if(this.reservationsByChild[res.childId] === undefined || this.reservationsByChild[res.childId] === null) {
              this.reservationsByChild[res.childId] = [];
            }
            let obj = {
              resid: res.id,
              lineName: res.lineName,
              tripIndex: res.tripIndex,
              direction: res.direction,
              date: dd+MM+yyyy
            };
            this.reservationsByChild[res.childId].push(obj)
          }
        }
        else{
          self.error = "Non sono presenti prenotazioni per oggi.";
          this.reservationsByChild = {};
        }
      }
    );
  }

  ngOnInit() {
  }

  /**
   * As the child selection changes, this method is in charge of retrieving the list of shifts corresponding to the
   * reservations related to the selected child, filter out the *expired* shifts and sort them by starting time.
   * The closest one by time will be subscribed to.
   * @param childId: value emitted by mat-select.
   */
  updateStompSubscription(childId){
    if(childId === -1) childId = this.kiddo;

    if(this.timeout_handle !== undefined && this.timeout_handle !== null){
      this.currentLineName = this.noLine;
      this.currentDirection = this.noDirection;
      clearTimeout(this.timeout_handle);
      if(this.stompSubscription !== undefined && this.stompSubscription !== null){
        this.stompSubscription.unsubscribe();
      }
    }

    let reservations = this.reservationsByChild[childId];
    let resids = [];
    let self = this;
    if(reservations !== undefined && reservations !== null) {
      for (let r of reservations) {
        resids.push(r.resid);
      }
    }
    if(resids.length <= 0){
      this.error = "Nessuna prenotazione trovata";
    }
    else{
      this.error = undefined;

      this.shiftService.getShiftsForReservations(resids)
        .pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(shifts_arrays => {
        if(shifts_arrays){
          let shifts = [];
          for(let s of shifts_arrays){
            shifts = shifts.concat(s);
          }

          let now = LocalTime.now();

          // filter out passed shifts;
          shifts = shifts.filter(s => {
            let sTime = LocalTime.parse(s.to.time);
            return sTime.isAfter(now)
          });

          // sort by departure time.
          shifts.sort((s1, s2) => {
            let s1Time = LocalTime.parse(s1.from.time);
            let s2Time = LocalTime.parse(s2.from.time);
            return s1Time.isBefore(s2Time)?-1:+1;
          });

          // calculate when the shift should stop to set a timeout and restart the process.
          let sEndTime = LocalTime.parse(shifts[0].to.time);
          let secondsToEnd = sEndTime.toSecondOfDay()-now.toSecondOfDay();

          this.currentShiftId = shifts[0].shiftId;
          this.currentLineName = shifts[0].lineName;
          this.currentDirection = shifts[0].direction;

          let latestUpdate: IGeoJsonObject = {
            position: shifts[0].latestUpdate,
            timestamp: 0
          };
          self.geoloc_subject.next(latestUpdate);

          // start subscription here.
          if(!this.stompClient.connected){
            let headers = this.localizationService.getAuthenticationHeaders();
            this.stompClient.connect(headers, () => {
                self.subscribeToCurrentShift();
            });
          }
          else{
            self.subscribeToCurrentShift();
          }

          // as the shift ends we need to subscribe to the next one given that there is one, but this will be
          // automagically checked by the first part of this method.
          self.timeout_handle = setTimeout(() => {
            self.updateStompSubscription(-1);
          }, secondsToEnd*1000);

        }
      });
    }
  }

  subscribeToCurrentShift(){
    let self = this;
    let headers = this.localizationService.getAuthenticationHeaders();
    this.stompSubscription = this.stompClient.subscribe("/topic/localize/"+this.currentShiftId, (msg) => {
          let payload: IGeoJsonObject;
          payload = JSON.parse(JSON.parse(msg.body).content);
          self.geoloc_subject.next(payload);
        },
        headers
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
