import {Component, OnInit, ViewChild} from '@angular/core';
import {ShiftConfirmationComponent} from "../shift-confirmation/shift-confirmation.component";
import {MatTabChangeEvent} from "@angular/material";

import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-shift-page',
  templateUrl: './shift-page.component.html',
  styleUrls: ['./shift-page.component.scss']
})
export class ShiftPageComponent implements OnInit {

  @ViewChild("confirm", {static: true}) confirmTab: ShiftConfirmationComponent;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
  }

  onTabChanged(event: MatTabChangeEvent){
  }

}
