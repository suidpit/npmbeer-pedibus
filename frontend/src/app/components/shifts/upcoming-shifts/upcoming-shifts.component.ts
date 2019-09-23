import { Component, OnInit } from '@angular/core';
import {LocalDateTime} from "js-joda";
import {Shift} from "../../../models/shift";
import {ShiftService} from "../../../services/shift/shift.service";
import {map} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs/internal/Observable";
@Component({
  selector: 'app-upcoming-shifts',
  templateUrl: './upcoming-shifts.component.html',
  styleUrls: ['./upcoming-shifts.component.scss']
})
export class UpcomingShiftsComponent implements OnInit {

  upcoming_shifts$ : Observable<Shift[]>;

  constructor(public shiftService: ShiftService) {
    this.shiftService.buildUpcomingEvents();
    this.upcoming_shifts$ = this.shiftService.getShifts().pipe(
      map((shifts) =>{
        shifts.sort((a, b) => a.date.isBefore(b.date)?-1:+1);
        return shifts;
      }
      ));
  }

  ngOnInit() {
  }

}
