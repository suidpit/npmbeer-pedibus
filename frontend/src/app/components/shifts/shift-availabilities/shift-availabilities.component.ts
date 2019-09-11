import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ShiftService} from "../../../services/shift/shift.service";
import dayGridPlugin from "@fullcalendar/daygrid";
import {DialogEventData, DialogEventInfo} from "../shift-calendar/shift-calendar.component";
import {FullCalendarComponent} from "@fullcalendar/angular";

@Component({
  selector: 'app-shift-availabilities',
  templateUrl: './shift-availabilities.component.html',
  styleUrls: ['./shift-availabilities.component.scss']
})
export class ShiftAvailabilitiesComponent implements OnInit {

  @ViewChild("availabilities", {static: true}) calendar: FullCalendarComponent;
  plugins = [dayGridPlugin];
  events = [];

  constructor(public shiftService: ShiftService, public dialog: MatDialog) { }

  ngOnInit() {
    let self = this;
    this.calendar.datesRender.subscribe((state)=>{
      let start = new Date(state.view.activeStart);
      let end = new Date(state.view.activeEnd);
      //self.shiftService.updateAvailabilties(start, end);
      self.shiftService.buildShifts(start, end);
    });

    this.shiftService.availabilities$.subscribe((aaa) => console.log(aaa));
  }

  eventShowPopup(info){
    let date = new Date(info.event.start);

    let shift = info.event.extendedProps.shift;
    let direction = shift.direction;
    let from = "[" + shift.startsAt.toString() + "] " + shift.from;
    let to = "[" + shift.endsAt.toString() + "] " + shift.to;
    let lineName = shift.lineName;
    const dialogRef = this.dialog.open(DialogEventNormal, {
      panelClass: 'event-dialog',
      width: "300px",
      data: { date: date, from: from, to: to, line: lineName, direction: direction, extendedProps: {obj:shift}}
    })
  }
}


@Component({
  selector: 'dialog-event-normal',
  templateUrl: 'dialog-event-normal.html',
})
export class DialogEventNormal {

  constructor(
    private shiftService: ShiftService,
    public dialogRef: MatDialogRef<DialogEventInfo>,
    @Inject(MAT_DIALOG_DATA) public data: DialogEventData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void{
    this.shiftService.sendShiftAvailability(this.data.extendedProps.obj);
    this.dialogRef.close();
  }

}

