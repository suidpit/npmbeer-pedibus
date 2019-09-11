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
import {Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";
import {Stop} from "../../models/stop";

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
                this.stopRows = data;
            });

        this.reservationsService.selected_stop_observer$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (stop) => {
                    if (stop != undefined) {
                        let index;

                        if (this.selectedDirection == 'OUTWARD') {
                            index = this.selectedRun
                        } else {
                            index = this.selectedRun - this.selectedLine.outward.length + 1
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
            if (this.selectedLine.outward[0].endsAt.isAfter(LocalTime.now()) || this.selectedDirection === 'outward') {
                this.selectedRun = 0;
            } else if (this.selectedLine.back[0].endsAt.isAfter(LocalTime.now())) {
                this.selectedRun = 1;
            } else if (this.selectedLine.back[1].endsAt.isAfter(LocalTime.now())) {
                this.selectedRun = 2;
            } else if (this.selectedDirection === 'back') {
                this.selectedRun = 1;
            } else {
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

        for (let r of this.selectedLine.outward) {
            temp_stops.push(r.stops);
        }
        for (let r of this.selectedLine.back) {
            temp_stops.push(r.stops);
        }

        this.stopService.initialize(temp_stops, width, window.innerWidth <= 600);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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
    children = new Map();
    status = "dialog";

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
                    this.children = new Map();
                    for (let c of children) {
                        this.children.set(c, false);
                    }
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
                    children.push(child);
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
                    if(resp.status == 409){
                        this.status = "completed";
                        this.errorMsg = "Uno dei bambini è già prenotato per questa tratta.";
                    }else{
                        this.status = "completed";
                        this.errorMsg = "Qualcosa è andato storto. Per favore riprovare più tardi.";
                    }
                    this.cd.markForCheck();
                    setTimeout(() => this.closeDialog(), 3000);
                })
        }
    }
}
