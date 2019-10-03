import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {ProfileService} from "../../../services/profile/profile.service";
import {Subject} from "rxjs/internal/Subject";
import {takeUntil} from "rxjs/operators";
import {User} from "../../../models/user";
import {NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy{

  userId;
  action;
  lineName;

  error = undefined;

  users = [];
  lineNames = [];

  private unsubscribe$ = new Subject<void>();

  public keys = Object.keys;
  constructor(public auth: AuthService, public profileService: ProfileService, private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.profileService.getUsers()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((users) => {
        this.users = [];
          for(let id of this.keys(users)){
            let u = {
              id: id,
              email: users[id]
            };
            this.users.push(u);
          }
        }
      );

    this.auth.currentUser$.pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe((user) => {
        this.lineNames = user.getAdminLines();
      });
  }

  openSnackbar(message: string, duration = 3000){
    this._snackBar.open(message, "OK", {
      duration: duration
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.error = true;
  };

  onSubmit() {
    if(this.lineName === undefined || this.userId === undefined || this.action === undefined){
      this.error = "Tutti i campi sono obbligatori.";
      return;
    }
    this.profileService.putUserAuthority(this.userId, this.action, this.lineName)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.error = undefined
        this.lineName = undefined;
        this.userId = undefined;
        this.action = undefined;
        this.openSnackbar("Operazione effettuata con successo");
      },
        (error) => {
        this.error = "Qualcosa è andato storto, riprova più tardi o contatta l'assistenza.";
          this.handleError(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
