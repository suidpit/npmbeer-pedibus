import { Component, OnInit } from '@angular/core';
import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";
import {AuthService} from "../../services/auth/auth.service";
import {LocalizationService} from "../../services/localization/localization.service";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {IGeoJsonObject} from "../../models/igeojson-object";
import {Observable} from "rxjs/internal/Observable";
import {AttendanceService} from "../../services/attendance/attendance.service";

@Component({
  selector: 'app-kid-tracker',
  templateUrl: './kid-tracker.component.html',
  styleUrls: ['./kid-tracker.component.scss']
})
export class KidTrackerComponent implements OnInit {

  geoloc_subject = new BehaviorSubject<IGeoJsonObject>(null);
  geolocalization$ = this.geoloc_subject.asObservable();
  stompClient;

  kiddo;
  line$: Observable<string>;
  direction_on = false;

  error = undefined;

  constructor(public auth: AuthService,
              public localizationService: LocalizationService,
              private attendanceService: AttendanceService) {
    this.stompClient = localizationService.getStompClient();
    let headers = localizationService.getAuthenticationHeaders();

    let self = this;

    let today = new Date();
    let dd = ("0" + today.getDate()).slice(-1);
    let MM = ("0" + (today.getMonth()+1)).slice(-1);
    let yyyy = today.getFullYear();

    this.attendanceService.todayReservations().subscribe((reservations) =>{
        debugger;
        if(reservations && reservations.length > 0){
          self.error = undefined;

          let res_object = {
            
          }
        }
        else{
          self.error = "Non sono presenti prenotazioni per oggi.";
        }
      }
    );

    this.stompClient.connect(headers, () =>{
      this.stompClient.subscribe("/topic/localize/5d86746e98200d9e44a15711", (msg) => {
          let payload: IGeoJsonObject;
          payload = JSON.parse(JSON.parse(msg.body).content);
          self.geoloc_subject.next(payload);
        },
        headers
      );
    });

  }

  ngOnInit() {
  }


  updateKidInfo(){

  }
}
