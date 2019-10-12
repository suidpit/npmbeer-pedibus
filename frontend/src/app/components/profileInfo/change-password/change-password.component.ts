import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, NgForm} from "@angular/forms";
import {ProfileService} from "../../../services/profile/profile.service";
import {ChangePassword} from "../../../models/changepassword";
import {Builder} from "builder-pattern";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";

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

    constructor(private profileService: ProfileService, private _snackBar: MatSnackBar) {
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
        if (error.error instanceof ErrorEvent) {
            this.openSnackbar("Qualcosa è andato storto, riprovare più tardi")
        } else {
            // The backend returned an unsuccessful response code.
            if (error.status == 403) {
                this.wrong_password = true;
                return;
            }
        }
        this.openSnackbar("Qualcosa è andato storto, riprovare più tardi")
    };

    openSnackbar(message: string, duration = 3000) {
        this._snackBar.open(message, "OK", {
            duration: duration
        });
    }

    onSubmit(form: NgForm) {
        this.profileService.changePassword(this.cp)
            .subscribe(
                () => {
                    this.wrong_password = false;
                    this.openSnackbar("Password cambiata con successo");
                    this.task = '';
                    form.resetForm();
                }, (error) => {
                    this.handleError(error);
                }
            );
    }
}
