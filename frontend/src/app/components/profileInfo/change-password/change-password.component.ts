import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, NgForm} from "@angular/forms";
import {ProfileService} from "../../../services/profile/profile.service";
import {ChangePassword} from "../../../models/changepassword";
import {Builder} from "builder-pattern";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  cp: ChangePassword;

  constructor(private profileService: ProfileService,
              private formBuilder: FormBuilder,) {
    this.cp = Builder(ChangePassword)
        .oldpass('')
        .pass('')
        .repass('')
        .build();
  }

  ngOnInit() {

  }

  onSubmit() {
    this.profileService.changePassword(this.cp);
  }
}
