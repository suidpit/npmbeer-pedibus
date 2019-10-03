import { Injectable } from '@angular/core';
import {ShiftService} from "../shift/shift.service";
import {AuthService} from "../auth/auth.service";
import {LocalDateTime, LocalTime} from "js-joda";
import {Shift} from "../../models/shift";
import {interval} from "rxjs/internal/observable/interval";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Subscription} from "rxjs/internal/Subscription";
import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";
import {map, take} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";
import {Role} from "../../models/authority";
import {IgnoredDependency} from "@angular/compiler-cli/ngcc/src/dependencies/dependency_resolver";
import {IGeoJsonObject} from "../../models/igeojson-object";

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  endpoint_url = 'http://localhost:8080/localization-endpoint';

  send_url = "/app/localize/";

  subscribe_url = "/topic/localize";

  localization_subject: BehaviorSubject<Coordinates> = new BehaviorSubject<Coordinates>(null);

  position_subscription: Subscription;

  polito_coordinates = <IGeoJsonObject> {
    position: {
      x: 7.659101486206054,
      y: 45.064427853360804,
      type: "Point",
      coordinates: [
        7.659101486206054,
        45.064427853360804
      ]
    },
    timestamp: 0
  };

  private web_socket;
  private stomp_client;

  constructor(private shiftService: ShiftService, private auth: AuthService) {
    // start streaming as soon as user logs in
    this.auth.isLoggedIn$.subscribe((login) =>{
      if(login){
        if(this.auth.getCurrentUser().hasMinAuthority(Role.COMPANION)){
          this.init_geoloc();
        }
      }
    })
  }

  public init_geoloc(){
    // if the browser supports it;
    if(navigator.geolocation){
      this.shiftService
        .getTodaysShifts()
        .pipe(
          map((shifts) =>{
            if(shifts.length > 0) {
              shifts.sort((a, b) => a.from.time.isBefore(b.from.time) ? -1 : +1);
              return shifts[0];
            }
            return null;
          })
        )
        .subscribe((shift: Shift) =>{
            if(shift && shift){
              let timems;
              let end_timems;
              if(LocalTime.now().isAfter(shift.from.time)){
                timems = 0;
              }
              else{
                timems = (shift.from.time.toSecondOfDay() - LocalTime.now().toSecondOfDay())*1000;
                end_timems = (shift.to.time.toSecondOfDay() - shift.from.time.toSecondOfDay())*1000;
              }
              console.log("Position streaming will start in "+Number(timems/(60*1000)).toFixed(2) + " minutes");

              // start streaming at shift start time -- stop at shift end
              setTimeout(() => {
                this.positionStreaming(true, shift);
                setTimeout(() => {
                  this.positionStreaming(false);
                }, end_timems)
              }, timems)
            }
          },
          (err) => console.log(err));
    }
  }

  positionStreaming(on = false, shift: Shift = null){
    if(on && shift != null){
      this.stomp_client = this.getStompClient();

      /**
       * If already connected start streaming, otherwise connect and stream.
       */
      if(this.stomp_client.connected){
        this.togglePositionStreaming(true, this.stomp_client, shift);
      }
      else{
        let headers = this.getAuthenticationHeaders();
        this.stomp_client.connect(headers, () =>{
          this.togglePositionStreaming(true, this.stomp_client, shift);
        });
      }
    }
    else if(!on) {
      this.togglePositionStreaming(false, this.stomp_client);
    }
  }

  private togglePositionStreaming(on = true, stompClient, shift: Shift = null){
    if(on && shift){
      console.log("Position streaming starting  in 20 seconds.");
      this.position_subscription = interval(20000).subscribe(() =>{

        //send position info.
        navigator.geolocation.getCurrentPosition(geolocation =>{
            let payload = {
              position: {
                type: "Point",
                coordinates: [geolocation.coords.longitude, geolocation.coords.latitude],
              },
              timestamp: geolocation.timestamp
            };

            let headers = this.getAuthenticationHeaders();
            stompClient.send("/app/localize/"+shift.id, headers, JSON.stringify(payload));
          },
          (error) =>{
            // if user doesn't give permission.
          })
      });
    }
    else if(!on) {
      if (this.position_subscription) {
        this.position_subscription.unsubscribe();
        // this.disconnectStompClient();
        // close web socket too.
      }
    }
  }

  getStompClient(){
    if(!this.web_socket || !this.stomp_client){
      this.web_socket = new SockJs(this.endpoint_url);
      this.stomp_client = Stomp.over(this.web_socket);
      this.stomp_client.debug = null;
    }
    return this.stomp_client;
  }

  connectStompClient(){
    if(this.stomp_client.connected){
      return;
    }
    let headers = this.getAuthenticationHeaders();
    this.stomp_client.connect(headers, () =>{ console.log("Stomp Client Connected")});
  }

  disconnectStompClient(){
    if(this.stomp_client.connected){
      let headers = this.getAuthenticationHeaders();
      this.stomp_client.disconnect(() => {}, headers);
    }
  }

  getAuthenticationHeaders(){
    return {Authentication: "bearer "+this.auth.getCurrentUserJwt()};
  }
}
