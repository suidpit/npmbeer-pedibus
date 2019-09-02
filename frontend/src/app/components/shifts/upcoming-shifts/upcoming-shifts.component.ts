import { Component, OnInit } from '@angular/core';
import {LocalDateTime} from "js-joda";
import {Shift} from "../../../models/shift";
import {ShiftService} from "../../../services/shift/shift.service";
@Component({
  selector: 'app-upcoming-shifts',
  templateUrl: './upcoming-shifts.component.html',
  styleUrls: ['./upcoming-shifts.component.scss']
})
export class UpcomingShiftsComponent implements OnInit {

  upcoming_shifts = [];

  constructor(public shiftService: ShiftService) {
    for(let i = 0; i < 5; i++){
      let dt = LocalDateTime.now();
      let shift = new Shift();
      shift.dateAndTime = dt;
      shift.direction = "BACK";
      shift.lineName = "Linea 2";
      this.upcoming_shifts.push(shift);
    }
  }

  ngOnInit() {
  }

}
