import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data/data.service";
import { MatDatepicker } from "@angular/material";
import { FormControl } from "@angular/forms";
import { Line } from 'src/app/models/line';
import { ILine } from 'src/app/models/iline';
import { LocalTime } from 'js-joda';

import { Child } from '../../models/child'
@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  selectedLine = [];
  lines = [];
  selectedDate = null;
  selectedDirection = undefined;
  isMobile = false;
  public res = [];
  
  /**
   * Filter passed to the date picker to filter out non-school days, i.e. sundays (0) and saturdays(6)
   * **/
  allowedDaysFilter = (d: Date): boolean => {
    let dayNum = d.getDay();
    return !(dayNum === 0 || dayNum === 6);
  };

  constructor(private dataService: DataService) {
    this.selectedDate = new FormControl(new Date());

    // check if it is a mobile user, if so, use touchUI elements for better targeting
    // see https://stackoverflow.com/a/25394023/6945436 for userAgent checking
    // TODO: check this on mobile, seems to work on desktop
    let userAgent = navigator.userAgent;
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
  }

  ngOnInit() {
    // this.dataService.getLines().subscribe(lines => {
    //   //console.log('Res comp: '+ lines);
    //   this.selectedLine = lines[1];
    //   return this.lines = lines;
    // });
    this.dataService.getLinesHttp().subscribe(data =>{
      //console.log('DATAAA: ' + JSON.stringify(data[1]['name']));
      //this.selectedLine.push(data[0]['name']);
      for(let d of data){
        this.lines.push(d);
      }
    });
    this.dataService.getReservationHttp()
    .subscribe(data=>{console.log(data)
      
      }  
    );

    this.dataService.getLinesHttp()
    .subscribe(data=>console.log(data));
    console.log('Lines: ' + this.selectedLine);
  }

  updateRunData(){
    this.selectedDirection = "outward";
    console.log("Set focus on the first available run")
  }
}
