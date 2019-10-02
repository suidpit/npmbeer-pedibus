import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, NgForm} from "@angular/forms";
import {ProfileService} from "../../../services/profile/profile.service";
import {ChangePassword} from "../../../models/changepassword";
import {Builder} from "builder-pattern";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    cp: ChangePassword;
    wrong_password = false;
    result = null;
    task = '';
    error = false;

    constructor(private profileService: ProfileService) {
        this.cp = Builder(ChangePassword)
            .oldpass('')
            .pass('')
            .repass('')
            .build();
    }

    ngOnInit() {
    }

    private handleError(error: HttpErrorResponse) {
        this.task = '';
        this.result = "false";
        if (error.error instanceof ErrorEvent) {
            this.error = true;
            this.result = "false";
        } else {
            // The backend returned an unsuccessful response code.
            if (error.status == 403) {
                this.wrong_password = true;
                return;
            }
        }
        this.error = true;
    };

    onSubmit(form: NgForm) {
        this.profileService.changePassword(this.cp)
            .subscribe(
                () => {
                    this.wrong_password = false;
                    this.error = false;
                    this.result = 'success';
                    this.task = '';
                    form.resetForm();
                }, (error) => {
                    this.handleError(error);
                }
            );
    }
}
