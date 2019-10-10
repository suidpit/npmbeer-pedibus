import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserProfile} from "../../../models/userProfile";
import {AuthService} from "../../../services/auth/auth.service";
import {ProfileService} from "../../../services/profile/profile.service";
import {Subject, throwError} from "rxjs";
import {catchError, take, takeUntil} from "rxjs/operators";
import {ReservationsService} from "../../../services/reservations/reservations.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: UserProfile;
    task = 'loading';
    selectedFile = null;
    previewUrl = null;
    lines = [];

    constructor(private profileService: ProfileService, private reservationService: ReservationsService,private _snackBar: MatSnackBar){
    }

    private unsubscribe$ = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit() {
        this.task = 'loading';
        this.profileService.user$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe((user) => {
            this.user = Object.assign({}, user);
            this.task = '';
        });
        this.reservationService.getLines().pipe(
            take(1),
            takeUntil(this.unsubscribe$)
        ).subscribe((lines) => {
            this.lines = lines;
        })
    }

    public saveUser() {

        this.task = 'loading';
        this.profileService.saveUser(this.user, this.selectedFile).subscribe(() => {
                this.task = '';
                this.openSnackbar("Operazione completata con successo");
                this.profileService.getProfileinformation();
                this.selectedFile = null;
                this.previewUrl = null;
            },
            (error) => {
                this.handleError(error);
            });
    }

    openSnackbar(message: string, duration = 3000) {
        this._snackBar.open(message, "OK", {
            duration: duration
        });
    }


    image_error: string = null;

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            this.openSnackbar("Qualcosa è andato stotro, riprovare più tardi");
        } else {
            // The backend returned an unsuccessful response code.
            if (error.status == 400) {
                this.openSnackbar("Formato errato");
            } else {
                this.openSnackbar("Qualcosa è andato stotro, riprovare più tardi");
            }
        }
        this.task = '';
    };

    selectFile(event) {
        const file = event.target.files.item(0)
        this.image_error = null;

        if (file != null) {
            // Show preview
            let mimeType = file.type;
            if (mimeType.match(/image\/*/) == null) {
                this.image_error = "Formato invalido";
                this.previewUrl = null;
                this.selectedFile = null;
                return;
            }
            if(file.size/1024/1024>10){
                this.image_error = "Dimensione eccede i 10MB";
                this.previewUrl = null;
                this.selectedFile = null;
                return;
            }

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.previewUrl = reader.result;
            }
            this.selectedFile = file;
        } else {
            this.previewUrl = null;
            this.selectedFile = null;
        }
    }

    findStops() {
        for (let line of this.lines) {
            let stops = [];
            if (line.name == this.user.defaultLine) {
                for (let stop of line.stops.stops) {
                    stops.push(stop.name);
                }
                return stops;
            }
        }
        return [];
    }
}
