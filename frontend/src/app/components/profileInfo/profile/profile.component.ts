import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserProfile} from "../../../models/userProfile";
import {AuthService} from "../../../services/auth/auth.service";
import {ProfileService} from "../../../services/profile/profile.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: UserProfile;
    task = 'loading';
    selected_pic: null;

    constructor(private profileService: ProfileService) {
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
        })
    }

    public saveUser() {

        this.task = 'loading';
        this.profileService.saveUser(this.user, this.selectedFile).subscribe(() => {
            this.task = '';
            this.profileService.getProfileinformation();
            this.selectedFile = null;
            this.previewUrl = null;
        }, (error) => {
            console.log(error);
        });
    }

    selectedFile = null;
    previewUrl = null;

    selectFile(event) {
        const file = event.target.files.item(0)

        if (file != null) {
            // Show preview
            let mimeType = file.type;
            if (mimeType.match(/image\/*/) == null) {
                alert('invalid format!');
                return;
            }

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.previewUrl = reader.result;
            }
            this.selectedFile = file;
        }else{
            this.previewUrl = null;
            this.selectedFile = null;
        }
    }
}
