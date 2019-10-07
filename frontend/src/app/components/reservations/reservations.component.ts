import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter, Inject, OnDestroy,
    OnInit, Output,
} from '@angular/core';
import {LocalTime} from "js-joda";
import {ReservationsService} from "../../services/reservations/reservations.service";
import {FormControl} from "@angular/forms";
import {StopService} from "../../services/stop/stop.service";
import {ResizedEvent} from "angular-resize-event";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {DialogAddKidData, Kid} from "../stop-row/stop-row.component";
import {BehaviorSubject, Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";
import {Stop} from "../../models/stop";
import {Child} from "../../models/child";

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, OnDestroy {


    private unsubscribe$ = new Subject<void>();

    stops = [];
    lines = [];
    selectedLine = null;
    oldSelectedLine = null;

    selectedRun = 0;
    selectedDate = null;
    selectedDirection = "outward";

    times = [];
    stopRows = undefined;
    allowedDaysFilter = (d: Date): boolean => {
        let dayNum = d.getDay();
        return !(dayNum === 0);
    };
    private previousWidth = 0;

    constructor(private dialog: MatDialog, private reservationsService: ReservationsService, private stopService: StopService) {
        this.selectedDate = new FormControl(new Date());
    }


    ngOnInit() {
        this.reservationsService.getLines()
            .pipe(
                take(1),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(
                (lines) => {
                    this.lines = lines;
                    this.selectedLine = this.lines[0];
                    this.updateData()
                }
            );

        this.stopService.stopsObserver$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if(data!=undefined) {
                    this.times = [];
                    this.times.push([]);
                    this.times.push([]);

                    for (let j = 0; j < this.selectedLine.stops.stops[0].outward.length; j++) {
                        //outward
                        let temp = [];
                        for (let i = 0; i < data[0].length; i++) {
                            temp.push([]);
                        }
                        for (let i = 0; i < data[0].length; i++) {
                            for(let k=0; k < data[0][i].length; k++) {
                                //stops
                                temp[i].push(data[0][i][k].outward[j]);
                            }

                        }
                        this.times[0].push(temp);
                    }

                    for (let j = 0; j < this.selectedLine.stops.stops[0].back.length; j++) {
                        //back
                        let temp = [];
                        for (let i = 0; i < data[1].length; i++) {
                            temp.push([]);
                        }
                        for (let i = 0; i < data[1].length; i++) {
                            for(let k=0; k < data[1][i].length; k++) {
                                //stops
                                temp[i].push(data[1][i][k].back[j]);
                            }
                        }
                        this.times[1].push(temp);
                    }
                }
                this.stopRows = data;
            });

        this.reservationsService.selected_stop_observer$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (stop) => {
                    if (stop != undefined) {
                        let index;

                        if (this.selectedDirection == 'outward') {
                            index = this.selectedRun
                        } else {
                            index = this.selectedRun - this.selectedLine.stops.stops[0].outward.length;
                        }

                        //get date
                        let date = this.selectedDate.value;
                        let darray = date.toLocaleDateString().split("/");
                        date = "";

                        darray.forEach((value) => {
                                if (value < 10) {
                                    date += "0" + value;
                                } else {
                                    date += value;
                                }
                            }
                        );

                        let dialogRef = this.dialog.open(BookingDialog, {
                            panelClass: "reservation-dialog",
                            data: {
                                line: this.selectedLine.name,
                                stop: stop,
                                date: date,
                                direction: this.selectedDirection,
                                index: index
                            }
                        });

                        dialogRef.afterClosed().subscribe(result => {
                            this.reservationsService.closePopup();
                            //ACTION AFTER CLOSE
                        })
                    }
                }
            )
    }


    updateData() {
        if (this.selectedLine != null) {
            let outs = this.selectedLine.stops.stops[0].outward.length;
            this.selectedRun = -1;
            for (let i = 0; i < outs; i++) {
                if (this.selectedLine.stops.endsAt[0][i].isAfter(LocalTime.now())) {
                    this.selectedRun = i;
                }
            }
            let backs = this.selectedLine.stops.stops[0].back.length;
            if (this.selectedRun == -1 || this.selectedDirection == 'back') {
                for (let i = 0; i < backs; i++) {
                    if (this.selectedLine.stops.endsAt[1][i].isAfter(LocalTime.now())) {
                        this.selectedRun = i + outs;
                    }
                }
            }
            if (this.selectedRun == -1) {
                this.selectedRun = 0;
                let today = new Date();
                today.setDate(today.getDate() + 1);
                this.selectedDate.setValue(today);
            }

            if (this.oldSelectedLine != this.selectedLine) {
                this.stopRows = undefined;
                this.oldSelectedLine = this.selectedLine;
                if (!isNaN(this.previousWidth)) {
                    this.setStops(this.previousWidth);
                }
            }
        }
    }

    onResize(event: ResizedEvent) {
        if (event instanceof ResizedEvent) {
            this.stopRows = undefined;
            if (this.selectedLine != null) {
                this.previousWidth = event.newWidth;
                this.setStops(event.newWidth);
            }
        }
    }

    setStops(width) {
        let temp_stops = [];

        temp_stops.push(this.selectedLine.stops.stops);
        temp_stops.push(this.selectedLine.stops.stops.slice().reverse());

        this.stopService.initialize(temp_stops, width, window.innerWidth <= 600);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.stopService.unsubscribe();
        this.reservationsService.unsubscribe();
    }

    changeTab() {
        let size = this.selectedLine.stops.stops[0].outward.length;
        if (this.selectedRun < size) {
            this.selectedDirection = 'outward';
        } else {
            this.selectedDirection = 'back';
        }
    }
}

export interface BookingData {
    line: string;
    stop: Stop;
    date: string;
    direction: string;
    index: number;
}

@Component({
        selector: 'booking-dialog-template',
        templateUrl: './booking-dialog.template.html',
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)

export class BookingDialog implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    children = new Map<Child, boolean>();
    status = "request";

    errorMsg = null;

    @Output("child-presence") change: EventEmitter<Kid> = new EventEmitter<Kid>();

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.reservationsService.children()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (children) => {
                    this.children = new Map<Child, boolean>();
                    for (let c of children) {
                        this.children.set(c, false);
                    }
                    this.status = "dialog";
                    this.cd.detectChanges();
                }
            );
    }

    constructor(
        private reservationsService: ReservationsService,
        @Inject(MAT_DIALOG_DATA) public data: BookingData,
        private cd: ChangeDetectorRef,
        public dialogRef: MatDialogRef<BookingDialog>) {
    }

    closeDialog() {
        this.dialogRef.close();
    }

    selectChild(child) {
        this.children.set(child, !this.children.get(child))
    }

    book() {
        let check = false;
        for (let v of this.children.values()) {
            if (v) {
                check = true;
                break;
            }
        }

        if (!check) {
            this.errorMsg = "Per favore seleziona almeno un bambino";
            return;
        } else {
            this.errorMsg = null;
            let children = [];
            this.children.forEach((value, child) => {
                if (value)
                    children.push(child.id);
            });
            this.status = "request";
            this.reservationsService.reserve(this.data.line, this.data.date, children, this.data.stop.name, this.data.direction, this.data.index)
                .subscribe((resp) => {
                    //success
                    this.status = "completed";
                    this.errorMsg = "Operazione completata con successo.";
                    this.cd.markForCheck();
                    setTimeout(() => this.closeDialog(), 3000);
                }, (resp) => {
                    if (resp.status == 409) {
                        this.status = "completed";
                        this.errorMsg = "Uno dei bambini è già prenotato per questa tratta.";
                    } else {
                        this.status = "completed";
                        this.errorMsg = "Qualcosa è andato storto. Per favore riprovare più tardi.";
                    }
                    this.cd.markForCheck();
                    setTimeout(() => this.closeDialog(), 3000);
                })
        }
    }
}
