import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserProfile} from "../../../models/userProfile";
import {AuthService} from "../../../services/auth/auth.service";
import {ProfileService} from "../../../services/profile/profile.service";
import {Subject, throwError} from "rxjs";
import {catchError, take, takeUntil} from "rxjs/operators";
import {ReservationsService} from "../../../services/reservations/reservations.service";
import {HttpErrorResponse} from "@angular/common/http";

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

    constructor(private profileService: ProfileService, private reservationService: ReservationsService) {
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
                this.error = null;
                this.task = '';
                this.profileService.getProfileinformation();
                this.selectedFile = null;
                this.previewUrl = null;
            },
            (error) => {
                this.handleError(error);
            });
    }


    public error = null;
    image_error: string = null;

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            this.error = "Qualcosa è andato storto, riprovare più tardi";
        } else {
            // The backend returned an unsuccessful response code.
            if (error.status == 400) {
                this.error = "Formato errato";
            } else {
                this.error = "Qualcosa è andato storto, riprovare più tardi";
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
        //TODO
        //Must me changed after fixing the lines db
        for (let line of this.lines) {
            let stops = [];
            if (line.name == this.user.defaultLine) {
                for (let stop of line.outward[0].stops) {
                    stops.push(stop.name);
                }
                return stops;
            }

        }
        return [];
    }
}
