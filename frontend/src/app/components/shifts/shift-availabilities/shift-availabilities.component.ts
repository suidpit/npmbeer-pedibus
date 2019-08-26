import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material";
import {ShiftService} from "../../../services/shift/shift.service";
import dayGridPlugin from "@fullcalendar/daygrid";

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

}
