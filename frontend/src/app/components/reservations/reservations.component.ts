import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data/data.service";
import { FormControl } from "@angular/forms";
import { Line } from 'src/app/models/line';
import { ILine } from 'src/app/models/iline';
import {LocalDate, LocalDateTime, LocalTime} from 'js-joda';

import { Child } from '../../models/child'
import {Stop} from "../../models/stop";
import {Builder} from "builder-pattern";
import {StopList} from "../../models/stop-list";
import {CHILDS} from "../../services/mock-childs";
@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  selectedLine = null;
  selectedRun = 0;
  lines = [];
  selectedDate = null;
  selectedDirection = "outward";

  reservations = [];
  reservedStops;

  isMobile = false;
  public res = [];

  /**
   * Filter passed to the date picker to filter out non-school days, i.e. sundays (0) and saturdays(6)
   * **/
  allowedDaysFilter = (d: Date): boolean => {
    let dayNum = d.getDay();
    return !(dayNum === 0);
  };

  constructor(private dataService: DataService) {
    this.selectedDate = new FormControl(new Date());

    // check if it is a mobile user, if so, use touchUI elements for better targeting
    // see https://stackoverflow.com/a/25394023/6945436 for userAgent checking
    // TODO: check this on mobile, seems to work on desktop
    let userAgent = navigator.userAgent;
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
    this.dataService.getLinesHttp().subscribe(data =>{
      this.lines = data.map(function (line) {
        let outwards: Array<StopList> = [];
        let backs: Array<StopList> = [];
        // map outwards
        for (let out of line.outward) {
          let stopList = Builder(StopList)
            .stops(out.map(function (stop) {
              let d = LocalDateTime.parse(stop.time.replace("Z", ""));
              let time = LocalTime.of(d.hour(), d.minute(), d.second());
              return Builder(Stop)
                .name(stop.name)
                .time(time)
                .position(stop.position)
                .childs(CHILDS.map(x => Object.assign({}, x)))
                .build();
            }))
            .build();
          outwards.push(stopList);
        }

        // map inwards
        for (let b of line.back) {
          let stopList = Builder(StopList)
            .stops(b.map(function (stop) {
              let d = LocalDateTime.parse(stop.time.replace("Z", ""));
              let time = LocalTime.of(d.hour(), d.minute(), d.second());
              return Builder(Stop)
                .name(stop.name)
                .time(time)
                .position(stop.position)
                .childs(CHILDS.map(x => Object.assign({}, x)))
                .build();
            }))
            .build();
          backs.push(stopList);
        }

        // finally build the Line
        return Builder(Line)
          .id(line.id)
          .lineName(line.name)
          .adminEmail(line.admin_email)
          .outward(outwards)
          .back(backs)
          .build();
      });
      this.selectedLine = this.lines[0];
    }, () => null, () =>this.updateData());
  }

  ngOnInit() {

  }

  updateData() {
    if (this.selectedLine != null) {
      if (this.selectedLine.outward[0].endsAt.isAfter(LocalTime.now()) || this.selectedDirection === 'outward') {
        this.selectedRun = 0;
        this.selectedDirection = 'outward';
      } else if (this.selectedLine.back[0].endsAt.isAfter(LocalTime.now())) {
        this.selectedRun = 1;
        this.selectedDirection = 'back';
      } else if (this.selectedLine.back[1].endsAt.isAfter(LocalTime.now())) {
        this.selectedRun = 2;
        this.selectedDirection = 'back';
      } else if (this.selectedDirection === 'back') {
        this.selectedRun = 1;
        this.selectedDirection = 'back';
      } else {
        this.selectedRun = 0;
        this.selectedDirection = 'outward';
      }

      this.updateReservation();
    }


  }

  togglePresence(child: Child) {
    console.log(child)
    child.present = !child.present
  }

  logEvent(event){
    console.log(event);
  }

  logger(){
    console.log(1);
  }

  updateReservation(){
    this.dataService.getReservationHttp()
      .subscribe(data=>{
        this.reservations = data.filter(res => {
          let d = LocalDate.parse(res.date);
          let selectedDate = LocalDate.of(
            this.selectedDate.value.getFullYear(),
            this.selectedDate.value.getMonth()+1,
            this.selectedDate.value.getDate());

          return d.equals(selectedDate) && res.lineName === this.selectedLine.lineName;
        });
      }, () => null, () =>{
        if(this.selectedLine != null){

          this.reservedStops = {"outward": [], "back": []};
          let arr = [];

          for(let stop of this.selectedLine.outward[0].stops){
            let children = this.childrenByStop(stop.name, 0, "outward");
            if(children !== undefined){
              arr.push(children);
            }
          }
          this.reservedStops["outward"].push(arr);

          let i = 0;
          for(let run of this.selectedLine.back){
            let arr = [];
            for(let stop of run.stops){
              let children = this.childrenByStop(stop.name, i, "back");
              if(children !== undefined){
                arr.push(children);
              }
            }
            this.reservedStops["back"].push(arr);
            i += 1;
          }
        }
      });
  }

  childrenByStop(stopName, index, direction){
    return this.reservations.filter(res =>{
      return res.stopName === stopName && res.direction === direction && res.tripIndex === index;
      })
      .map(res => {
        return {"name":res.childName, "hadReservation":true, isPresent:false}})
      .sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        else return 0;
      });

  }

  updateRunData(){
    this.selectedDirection = "outward";
    console.log("Set focus on the first available run")
  }
}
