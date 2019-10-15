import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from "../../../services/profile/profile.service";
import {Child} from "../../../models/child";
import {FormControl} from "@angular/forms";
import {map, startWith, takeUntil} from "rxjs/operators";
import {Observable, Subject, fromEvent} from "rxjs";
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from "@angular/material";
import {throttleTime} from "rxjs/operators";


@Component({
    selector: 'app-manage-children',
    templateUrl: './manage-children.component.html',
    styleUrls: ['./manage-children.component.scss']

})
export class ManageChildrenComponent implements OnInit, OnDestroy {

    title = null;
    child_to_update = null;
    surname = new FormControl('');
    birthday = new FormControl('');
    children = null;
    private unsubscribe$ = new Subject<void>();
    previewUrl = null;
    selectedFile: File = undefined;

    selectFile(event) {
        const file = event.target.files.item(0)

        // Show preview
        if (file != null) {
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
        } else {
            this.selectedFile = null;
            this.previewUrl = null;
        }
    }


    constructor(private profileService: ProfileService, private _snackBar: MatSnackBar) {
    }

    openSnackbar(message: string, duration = 3000) {
        this._snackBar.open(message, "OK", {
            duration: duration
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    isScreenSmall$ = null;
    ngOnInit() {
        // Checks if screen size is less than 1024 pixels
        const checkScreenSize = () => document.body.offsetWidth < 600;

        // Create observable from window resize event throttled so only fires every 500ms
        const screenSizeChanged$ = fromEvent(window, 'resize').pipe(throttleTime(500), map(checkScreenSize));

        // Start off with the initial value use the isScreenSmall$ | async in the
        // view to get both the original value and the new value after resize.
        this.isScreenSmall$ = screenSizeChanged$.pipe(startWith(checkScreenSize()))


        this.profileService.children$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe((children) => {
            this.children = children;
        })
    }

    private sanitizer: DomSanitizer;

    task_children(child: Child) {
        this.title = null;
        this.child_to_update = null;
        this.selectedFile = null;
        if (child == null) {
            this.child_to_update = new Child();
            this.title = "Aggiungi Nuovo Bambino";
        } else {
            this.child_to_update = Object.assign({}, child);
            let day = this.child_to_update.birthday.split("-");
            let bday = new Date();
            bday.setMonth(day[1] - 1);
            bday.setDate(day[0]);
            bday.setFullYear(day[2]);
            this.child_to_update.birthday = bday;
            this.title = "Modifica Dati Bambino";
        }
    }

    task = '';

    onSubmit() {
        this.task = 'loading';
        let child = Object.assign({}, this.child_to_update);
        let day = child.birthday.getDate().toString();
        if (day.length == 1)
            day = "0" + day;
        let month = (child.birthday.getMonth() + 1).toString();
        if (month.length == 1)
            month = "0" + month;
        child.birthday = day + "-" +
            month + "-" +
            child.birthday.getFullYear();
        if (child.id == null) {
            this.profileService.addChild(child, this.selectedFile).subscribe(() => {
                this.task = '';
                this.title = null;
                this.openSnackbar("Operazione completata");
                this.profileService.getChildren();
                this.child_to_update = null;
                this.selectedFile = null;
                this.previewUrl = null;
            },() => {
                this.task = '';
                this.openSnackbar("Qualcosa è andato storto, riprovare più tardi");
            }
        )

        } else {
            this.profileService.updateChild(child, this.selectedFile).subscribe(() => {
                    this.task = '';
                    this.title = null;
                    this.openSnackbar("Operazione completata");
                    this.profileService.getChildren();
                    this.child_to_update = null;
                    this.selectedFile = null;
                    this.previewUrl = null;
                },() => {
                    this.task = '';
                    this.openSnackbar("Qualcosa è andato storto, riprovare più tardi");
                }
            )
        }
    }

    onDelete() {
        this.task = 'loading';
        this.profileService.deleteChild(Object.assign({}, this.child_to_update)).subscribe(() => {
                this.task = '';
                this.title = null;
                this.openSnackbar("Operazione completata");
                this.profileService.getChildren();
                this.child_to_update = null;
                this.selectedFile = null;
                this.previewUrl = null;
            },() => {
                this.task = '';
                this.openSnackbar("Qualcosa è andato storto, riprovare più tardi");
            }
        )
    }
}

@Component({
    selector: 'app-child-card',
    templateUrl: './child-card.html',
    styleUrls: ['./child-card.scss']
})
export class ChildCardComponent {
    @Input("pic") pic;
    @Input("name") name;
    @Input("sex") sex;
    @Input("birthday") birthday;
}
