import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material";
import {ShiftService} from "../../../services/shift/shift.service";
import dayGridPlugin from "@fullcalendar/daygrid";
import {DialogEventInfo} from "../shift-calendar/shift-calendar.component";

@Component({
  selector: 'app-shift-availabilities',
  templateUrl: './shift-availabilities.component.html',
  styleUrls: ['./shift-availabilities.component.scss']
})
export class ShiftAvailabilitiesComponent implements OnInit {

  plugins = [dayGridPlugin];
  events = [];

  constructor(public shiftService: ShiftService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  eventShowPopup(info){
    let date = new Date(info.event.start);
    let fields = info.event.title.split(" ");
    let direction = fields.slice(-1)[0];
    let time = fields[0];
    let lineName = fields.slice(1, -1).join(" ");
    const dialogRef = this.dialog.open(DialogEventInfo, {
      panelClass: 'event-dialog',
      width: "300px",
      data: { date: date, time: time, line: lineName, direction: direction }
    })
  }
}
