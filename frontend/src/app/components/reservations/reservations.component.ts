import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data/data.service";
import { MatDatepicker } from "@angular/material";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  selectedLine = null;
  lines = null;
  selectedDate = null;
  selectedDirection = undefined;
  isMobile = false;

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
    this.dataService.getLines().subscribe(lines => {
      this.selectedLine = lines[1];
      return this.lines = lines;
    });
  }

  updateRunData(){
    this.selectedDirection = "outward";
    console.log("Set focus on the first available run")
  }
}
