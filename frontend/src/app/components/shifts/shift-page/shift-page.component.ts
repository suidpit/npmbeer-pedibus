import {Component, OnInit, ViewChild} from '@angular/core';
import {ShiftConfirmationComponent} from "../shift-confirmation/shift-confirmation.component";
import {MatTabChangeEvent} from "@angular/material";

@Component({
  selector: 'app-shift-page',
  templateUrl: './shift-page.component.html',
  styleUrls: ['./shift-page.component.scss']
})
export class ShiftPageComponent implements OnInit {

  @ViewChild("confirm", {static: true}) confirmTab: ShiftConfirmationComponent;

  constructor() { }

  ngOnInit() {
  }

  onTabChanged(event: MatTabChangeEvent){
  }

}
