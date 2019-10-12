import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {LocalTime} from 'js-joda';

import {Child} from '../../models/child'
import {AttendanceService} from 'src/app/services/attendance/attendance.service';
import {Subject} from "rxjs";
import {map, take, takeUntil} from "rxjs/operators";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProfileService} from "../../services/profile/profile.service";
import {Observable} from "rxjs/internal/Observable";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

export interface IReservedStops {
  outward: Array<any[]>;
  back: Array<any[]>;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  selectedLine = null;
  selectedRun = 0;
  tripIndex = 0;
  lines = [];
  selectedDate = null;
  selectedDirection = "outward";

  reservations ;
  reservedStops;
  reservedStopsSubject: BehaviorSubject<IReservedStops> = new BehaviorSubject<IReservedStops>(null);
  reservedStops$: Observable<IReservedStops> = this.reservedStopsSubject.asObservable();


  notReservedKidsSubject: BehaviorSubject<Child[]> = new BehaviorSubject(null);
  notReservedKids$: Observable<Child[]> = this.notReservedKidsSubject.asObservable();
  isMobile = false;
  public res = [];
  isFirst=true;

  /**
   * Filter passed to the date picker to filter out non-school days, i.e. sundays (0) and saturdays(6)
   * **/
  allowedDaysFilter = (d: Date): boolean => {
    let dayNum = d.getDay();
    return !(dayNum === 0);
  };

  public downloadJsonHref: SafeUrl;
  public jsonFilename = ".json";

  constructor(private attendanceService: AttendanceService,
              private profileService: ProfileService,
              private sanitizer: DomSanitizer) {
    this.selectedDate = new FormControl(new Date());
    // check if it is a mobile user, if so, use touchUI elements for better targeting
    // see https://stackoverflow.com/a/25394023/6945436 for userAgent checking
    // TODO: check this on mobile, seems to work on desktop
    let userAgent = navigator.userAgent;
    this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
    this.attendanceService.lines()
        .pipe(
            take(1),
            takeUntil(this.unsubscribe$)
        )
        .subscribe(data => {
      this.lines = data
    }, () => null, () => {
      this.selectedLine = this.lines[0];
      this.updateData()
    });
  }

  ngOnInit() {

  }

  /**
   * This method is called whenever line or date is changed: its basic functionality
   * is to decide which will be the next sooner ride to display as first.
   */
  updateData() {
    let index;
    if (this.selectedLine != null) {
      if (this.selectedLine.stops.endsAt[0][0].isAfter(LocalTime.now()) || this.selectedDirection === 'outward') {
        index = 0;
      } else if (this.selectedLine.stops.endsAt[1][0].isAfter(LocalTime.now())) {
        index = 1;
      } else if (this.selectedLine.stops.endsAt[1][1].isAfter(LocalTime.now())) {
        index = 2;
      } else if (this.selectedDirection === 'back') {
        index = 1;
      } else {
        index = 0;
        let today = new Date();
        today.setDate(today.getDate() + 1);
        this.selectedDate.setValue(today);
      }

      this.updateReservation();
      this.selectedRun = index;
    }
  }


  /**
   * This method performs the actual update of the reservations, pulling down all of them for a given date and line.
   * An other function is to update the reservedStop (actual object passed down to the mat-list items) and the
   * NotReservedKidsSubject, which contains the list of children NOT reserved for the current run (so to display them
   * for on-the-fly-addition).
   */
  updateReservation() {
    let day = this.selectedDate.value.getDate().toString();
    let month = (this.selectedDate.value.getMonth() + 1).toString();

    if(day.length < 2){
      day = "0" + day;
    }

    if (month.length < 2){
      month = "0" + month;
    }

    let year = this.selectedDate.value.getFullYear();
    let date = day.toString() + month + year.toString();
    this.reservations = null;
    // Retrieve reservations
    this.attendanceService.reservations(this.selectedLine.name, date)
        .pipe(
            takeUntil(this.unsubscribe$)
        )
        .subscribe(data => {
          this.reservations = data;
        }, () => null, () => {
          if(this.selectedLine != null){
            this.reservedStops = {"outward": [], "back": []};
            let arr = [];

            // build ReservedStops object.
            for(let i=0; i<this.selectedLine.stops.stops[0].outward.length; i++){
              this.reservedStops["outward"].push([]);
            }
            for(let i=0; i<this.selectedLine.stops.stops[0].back.length; i++){
              this.reservedStops["back"].push([]);
            }

            for(let stop of this.selectedLine.stops.stops){
              //outward
              for(let i=0; i<stop.outward.length; i++){
                let children = this.childrenByStop(stop.name, i, "outward");
                if(children!==undefined){
                  this.reservedStops["outward"][i].push(children);
                }else{
                  this.reservedStops["outward"][i].push([]);
                }
              }

              //backward
              for(let i=0; i<stop.back.length; i++){
                let children = this.childrenByStop(stop.name, i, "back");
                if(children!==undefined){
                  this.reservedStops["back"][i].push(children);
                }else{
                  this.reservedStops["back"][i].push([]);
                }
              }

            }
            for(let i=0; i<this.selectedLine.stops.stops[0].back.length; i++) {
              this.reservedStops["back"][i] = this.reservedStops["back"][i].slice().reverse();
            }
            this.reservedStopsSubject.next(this.reservedStops);
            this.buildDownloadFile();
          }

          /*
          * retrieve all the ids of the non reserved kids, retrieve the whole of them with all of their data
          * then filter out those who had reservation.
          * */
          this.attendanceService.getNotReservedKids(date, this.selectedLine.name, this.selectedDirection, this.tripIndex)
            .pipe(
              takeUntil(this.unsubscribe$)
            )
            .subscribe((childIds) => {
                this.profileService.getAllChildren()
                  .pipe(
                    map((children) => {
                      let filtered: Child[] = [];
                      for (let c of children) {
                        if (childIds.includes(c.id)) {
                          filtered.push(c);
                        }
                      }
                      return filtered;
                    }),
                    takeUntil(this.unsubscribe$))
                  .subscribe((children) => this.notReservedKidsSubject.next(children));
              }
              );
          });
  }

  childrenByStop(stopName, index, direction) {
    let reservations = null;
    if (direction == 'outward') {
      reservations = this.reservations.outward[index];
      if(reservations!=undefined) {
        reservations = reservations.filter(res => {
          return res.stopName === stopName;
        });
        if(reservations!=undefined){
          reservations=reservations[0];
        }
      }
    }else{
      reservations = this.reservations.backward[index];
      if(reservations!=undefined) {
        reservations = reservations.filter(res => {
          return res.stopName === stopName;
        });
        if(reservations!=undefined){
          reservations=reservations[0];
        }

      }
    }

    if(reservations!=undefined && reservations.childs!=undefined)
      return reservations.childs.sort(function (a, b) {
          if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        else return 0;
      });
    else
      return undefined;

  }

  /**
   * Calls the service method to add a child on-the-fly
   * @param childResInfo: event emitted by component
   */
  addChild(childResInfo){
    let dateString = this.getDateString();
    this.attendanceService.addOnTheFlyChild(
      childResInfo.id, childResInfo.stop,
      this.selectedLine.name, this.selectedDirection,
       this.tripIndex, dateString).subscribe((result) =>{
      this.updateData();
    })
  }

  /**
   * Toggles child presence for a reservation.
   * @param childResInfo: event emitted by component
   */
  toggleChildPresence(childResInfo){
    this.attendanceService.togglePresence(childResInfo.resid, childResInfo.isPresent).subscribe((result) =>{
      this.updateData();
    })
  }

  buildDownloadFile(){
    let jsonObject = {
      linea: this.selectedLine.name,
      direzione: this.selectedDirection==="outward"?"scuola":"casa",
      indiceCorsa: this.tripIndex,
      fermate: []
    };

    for(let i=0; i<this.reservedStops[this.selectedDirection][this.tripIndex].length; i++){
      let stop;
      if(this.selectedDirection === "outward"){
        stop = {
          nomeFermata: this.selectedLine.stops.stops[i].name,
          presenze: this.reservedStops[this.selectedDirection][this.tripIndex][i]
        }
      }
      else{
        stop = {
          nomeFermata: this.selectedLine.stops.stops[i].name,
          presenze: this.reservedStops[this.selectedDirection][this.tripIndex][i]
        }
      }
      jsonObject.fermate.push(stop);
    }

    let theJSON = JSON.stringify(jsonObject);
    let uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;

    let dateString = this.getDateString();
    this.jsonFilename = "FoglioPresenze_"+this.selectedLine.name+"_"+
      this.selectedDirection+this.tripIndex+"_"+
      dateString+".json";
  }

  private getDateString(){
    let day = this.selectedDate.value.getDate().toString();
    let month = (this.selectedDate.value.getMonth() + 1).toString();

    if(day.length < 2){
      day = "0" + day;
    }

    if (month.length < 2){
      month = "0" + month;
    }

    let year = this.selectedDate.value.getFullYear();
    return day.toString() + month + year.toString();
  }

  /**
   * Updates the tripIndex (run number) taking into consideration the current selected tab index (later updated) and
   * the direction.
   * @param event
   */
  public tabSwitch(event){
    this.selectedRun = event.index;
    let fields = event.tab.textLabel.split(" ");
    this.tripIndex = event.index;
    // the following is because the backward tabs indexes start with an offset = to the number of outward runs.
    if(fields[0].match(/Ritorno/i)){
      this.tripIndex -= this.selectedLine.stops.stops[0].outward.length;
      this.selectedDirection = "back";
    }
    else{
      this.selectedDirection = "outward";
    }
    if(this.isFirst) this.isFirst = false;
    else this.updateReservation();
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
