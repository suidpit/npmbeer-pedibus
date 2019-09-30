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
    let socket = new SockJs('http://localhost:8080/localization-endpoint');
    let stompClient = Stomp.over(socket);
    let self = this;
    let headers = {Authentication: "bearer "+auth.getCurrentUserJwt()};
    stompClient.connect(headers, () =>{
      stompClient.send("/app/localize/1", headers, JSON.stringify("MESSAGGIONE"));
    });
  }

  ngOnInit() {
  }

  onTabChanged(event: MatTabChangeEvent){
  }

}
