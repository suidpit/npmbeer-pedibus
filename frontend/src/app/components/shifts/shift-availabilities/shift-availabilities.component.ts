import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatFormField, MatSelect, MatSnackBar} from "@angular/material";
import {ShiftService} from "../../../services/shift/shift.service";
import dayGridPlugin from "@fullcalendar/daygrid";
import {DialogEventData, DialogEventInfo} from "../shift-calendar/shift-calendar.component";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {AuthService} from "../../../services/auth/auth.service";
import {LineService} from "../../../services/lines/line.service";
import {ObservableInput} from "rxjs/internal/types";
import {Line} from "../../../models/line";
import {Observable} from "rxjs/internal/Observable";
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Shift} from "../../../models/shift";
import {of} from "rxjs/internal/observable/of";
import {Stop} from "../../../models/stop";
import {LocalTime} from "js-joda";
import {Role} from "../../../models/authority";

@Component({
    selector: 'app-shift-availabilities',
    templateUrl: './shift-availabilities.component.html',
    styleUrls: ['./shift-availabilities.component.scss']
})
export class ShiftAvailabilitiesComponent implements OnInit {

    @ViewChild("availabilities", {static: true}) calendar: FullCalendarComponent;
    plugins = [dayGridPlugin];
    events = [];
    isAdmin = false;

    constructor(public shiftService: ShiftService,
                private auth: AuthService,
                public dialog: MatDialog,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit() {
        let self = this;
        this.calendar.datesRender.subscribe((state) => {
            let start = new Date(state.view.activeStart);
            let end = new Date(state.view.activeEnd);
            //self.shiftService.updateAvailabilties(start, end);
            self.shiftService.buildShifts(start, end);
        });


        this.isAdmin = this.auth.getCurrentUser().hasMinAuthority(Role.ADMIN);
    }

    eventShowPopup(info) {
        let date = new Date(info.event.start);

        let shift = info.event.extendedProps.shift;
        let direction = shift.direction;
        let from = "[" + shift.startsAt.toString() + "] " + shift.from;
        let to = "[" + shift.endsAt.toString() + "] " + shift.to;
        let lineName = shift.lineName;
        if (this.auth.hasAuthorityOnLine(lineName)) {
            const dialogRef = this.dialog.open(DialogEventAdmin, {
                panelClass: 'admin-availability-dialog',
                width: "550px",
                data: {
                    date: date,
                    from: from,
                    to: to,
                    line: lineName,
                    direction: direction,
                    extendedProps: {obj: shift}
                }
            });

            dialogRef.afterClosed().subscribe((res) => {
                switch (res) {
                    case "a-sent":
                        this.openSnackbar("Candidatura inviata!");
                        break;
                    case "a-aborted":
                        break;
                    case "a-canceled":
                        this.openSnackbar("Candidatura ritirata.");
                        break;
                    case "a-assigned":
                        this.openSnackbar("Turno assegnato con successo.");
                        break;
                    case "a-denied-cancel":
                        this.openSnackbar("Non è possibile ritirare la candidatura.");
                        break;
                }
            })
        } else {
            const dialogRef = this.dialog.open(DialogEventNormal, {
                panelClass: 'event-dialog',
                width: "300px",
                data: {
                    date: date,
                    from: from,
                    to: to,
                    line: lineName,
                    direction: direction,
                    extendedProps: {obj: shift}
                }
            });

            dialogRef.afterClosed().subscribe((res) => {
                switch (res) {
                    case "a-sent":
                        this.openSnackbar("Candidatura inviata!");
                        break;
                    case "a-aborted":
                        break;
                    case "a-canceled":
                        this.openSnackbar("Candidatura ritirata.");
                        break;
                    case "a-denied-cancel":
                        this.openSnackbar("Non è possibile ritirare la candidatura.");
                        break;
                }
            });

        }
    }

    openSnackbar(message: string, duration = 3000) {
        this._snackBar.open(message, "OK", {
            duration: duration
        });
    }
}


@Component({
    selector: 'dialog-event-normal',
    templateUrl: 'dialog-event-normal.html',
})
export class DialogEventNormal {

    constructor(
        private shiftService: ShiftService,
        public dialogRef: MatDialogRef<DialogEventInfo>,
        @Inject(MAT_DIALOG_DATA) public data: DialogEventData) {
    }

    onNoClick(): void {
        this.dialogRef.close("a-aborted");
    }

    onOkClick(): void {
        this.shiftService.sendShiftAvailability(this.data.extendedProps.obj).subscribe(() => {
            this.shiftService.buildShifts();
            this.dialogRef.close("a-sent");
        });
    }


    onCancelClick(): void {
        this.shiftService.cancelShiftAvailability(this.data.extendedProps.obj).subscribe((result) => {
            this.shiftService.buildShifts();
            this.dialogRef.close("a-canceled");
        })
    }

}

@Component({
    selector: 'dialog-event-admin',
    templateUrl: 'dialog-event-admin.html',
})
export class DialogEventAdmin {

    private stops$: Observable<Stop[]>;
    private stop_dict = {};
    public shiftInputs;
    private readonly shift: Shift;
    private warning: boolean;

    constructor(
        private shiftService: ShiftService,
        private lineService: LineService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DialogEventInfo>,
        @Inject(MAT_DIALOG_DATA) public data: DialogEventData) {

        this.shift = data.extendedProps.obj;
        if (this.shift != null) {
            this.lineService.getLineByName(this.shift.lineName).subscribe((data) => {
                if (data !== null && data !== undefined) {
                    let line = new Line(data);
                    let stops = [];
                    if(this.shift.direction=='OUTWARD') {
                        let i=0;
                        for (; i<line.stops.stops.length; i++) {
                            if (line.stops.stops[i].name == this.shift.from) {
                                i++;
                                break;
                            }
                        }
                        for(; i<line.stops.stops.length; i++){
                            let stop = new Stop();
                            Object.assign(stop, line.stops.stops[i]);
                            stops.push(stop);
                            this.stop_dict[stop.name] = stop;
                        }
                    }else{
                        let i=line.stops.stops.length-1;
                        for (; i>=0; i--) {
                            if (line.stops.stops[i].name == this.shift.from) {
                                i--;
                                break;
                            }
                        }
                        for(; i>=0; i--){
                            let stop = new Stop();
                            Object.assign(stop, line.stops.stops[i]);
                            stops.push(stop);
                            this.stop_dict[stop.name] = stop;
                        }
                    }
                    this.stops$ = of(stops);
                }
            });
        }


        this.shiftInputs = this.formBuilder.group({
            companion: ["", [
                Validators.required
            ]],
            stop: [this.shift.to, [
                Validators.required,
                this.checkStop()
            ]]
        });

    }

    checkStop(): ValidatorFn {
        return (c: FormControl) => {
            let isValid = c.value.name === this.shift.to;
            if (isValid || c.value.name==null) {
                this.warning = false;
                return null;
            } else {
                this.warning = true;
                return null;
            }
        }
    }

    onNoClick(): void {
        this.dialogRef.close("a-aborted");
    }

    onOkClick(): void {
        this.shiftService.sendShiftAvailability(this.data.extendedProps.obj).subscribe(() => {
            this.shiftService.buildShifts();
            this.dialogRef.close("a-sent");
        });
    }

    onCancelClick(): void {
        this.shiftService.cancelShiftAvailability(this.shift).subscribe((result) => {
                this.shiftService.buildShifts();
                this.dialogRef.close("a-canceled");
            },
            (err) => {
                this.dialogRef.close("a-denied-cancel");
            })
    }

    setCompanion() {
        let to = null;
        if (this.shiftInputs.controls["stop"].value.name !== this.shift.to) {
            to = this.stop_dict[this.shiftInputs.controls["stop"].value.name];
        }

        let companion_email = this.shiftInputs.controls["companion"].value;

        this.shiftService.sendShiftAssignment(this.shift, companion_email, to).subscribe((result) => {
            this.shiftService.buildShifts();
            this.dialogRef.close("a-assigned")
        });
    }

}

