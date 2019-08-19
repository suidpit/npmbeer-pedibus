import {Component, Inject, OnInit} from '@angular/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import Tooltip from "tooltip.js";
import {ShiftService} from "../../../services/shift/shift.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";


export  interface DialogEventData {
  date: Date;
  time: string;
  line: string;
  direction: string;

}

@Component({
  selector: 'app-shift-calendar',
  templateUrl: './shift-calendar.component.html',
  styleUrls: ['./shift-calendar.component.scss']
})
export class ShiftCalendarComponent implements OnInit {

  calendarPlugins = [dayGridPlugin];
  events = [];



  constructor(public shiftService: ShiftService, public dialog: MatDialog) {
  }

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

  /*
  * NOT WORKING
  * */
  eventRenderTooltip(info){
    let tooltip = new Tooltip(info.el, {
      title:      info.event.title,
      placement:  "top",
      trigger:    "hover",
      container:  "body"
    });
    tooltip.show();
  }
}

@Component({
  selector: 'dialog-event-info',
  templateUrl: 'dialog-event-info.html',
})
export class DialogEventInfo {

  constructor(
    public dialogRef: MatDialogRef<DialogEventInfo>,
    @Inject(MAT_DIALOG_DATA) public data: DialogEventData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
