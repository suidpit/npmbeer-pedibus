import {Component, Inject, OnInit, ViewChild} from '@angular/core';
  import dayGridPlugin from "@fullcalendar/daygrid";
import Tooltip from "tooltip.js";
import {ShiftService} from "../../../services/shift/shift.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {LocalTime} from "js-joda";


export  interface DialogEventData {
  date: Date;
  from: string;
  startsAt: LocalTime;
  endsAt: LocalTime;
  to: string;
  line: string;
  direction: string;
  extendedProps: { obj: any}
}

@Component({
  selector: 'app-shift-calendar',
  templateUrl: './shift-calendar.component.html',
  styleUrls: ['./shift-calendar.component.scss']
})
export class ShiftCalendarComponent implements OnInit {

  @ViewChild("calendar", {static: true}) calendar: FullCalendarComponent;
  calendarPlugins = [dayGridPlugin];
  events = [];

  constructor(public shiftService: ShiftService, public dialog: MatDialog) {
  }

  ngOnInit() {
    let self = this;
    this.calendar.datesRender.subscribe((state)=>{
      let start = new Date(state.view.activeStart);
      self.shiftService.updateCalendarShifts(start);
    });
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
