import {Component, Input, OnInit} from '@angular/core';
import {Shift} from "../../../models/shift";

@Component({
  selector: 'app-shift-chip',
  templateUrl: './shift-chip.component.html',
  styleUrls: ['./shift-chip.component.scss']
})
export class ShiftChipComponent implements OnInit {

  @Input("shift") shift: Shift;

  constructor() {
  }

  ngOnInit() {
  }

}
