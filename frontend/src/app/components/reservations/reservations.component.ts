import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {LocalDate, LocalTime, ZoneId} from "js-joda";
import {ReservationsService} from "../../services/reservations/reservations.service";
import {FormControl} from "@angular/forms";
import {StopService} from "../../services/stop/stop.service";
import {ResizedEvent} from "angular-resize-event";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from "@angular/material";
import {Subject} from "rxjs";
import {take, takeUntil} from "rxjs/operators";
import {CalendarView} from "angular-calendar";
import {Reservation} from "../../models/reservation";
import {registerLocaleData} from "@angular/common";
import localeIt from '@angular/common/locales/it';

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    view: CalendarView = CalendarView.Week;
    viewDate: Date = new Date();

    stops = [];
    lines = [];
    selectedLine = null;
    selectedRun = 0;
    selectedDate = null;
    times = [];
    timestamp = 0;
    selectedChild = null;
    opening: boolean = false;
    locale: string = 'it';
    selectedReservation: Reservation = undefined;


    stopRows = undefined;

    private previousWidth = 0;

    constructor(private dialog: MatDialog, private reservationsService: ReservationsService, private stopService: StopService, private _snackBar: MatSnackBar) {
        this.selectedDate = new FormControl(new Date());
        registerLocaleData(localeIt, 'it');
    }


    updateChild() {
        this.selectedReservation = undefined;
        this.today = false;
        this.selectedLine = this.selectedLine[0];
        this.selectedRun = 0;
        if (this.selectedChild != null)
            this.reservationsService.buildReservations(this.getMonday(new Date()), this.selectedChild.id);
    }

    children = [];

    ngOnInit() {
        this.reservationsService.children()
            .pipe(
                take(1),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((children) => {
                this.children = children;
            });

        this.reservationsService.getLines()
            .pipe(
                take(1),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(
                (lines) => {
                    this.lines = lines;
                    this.selectedLine = this.lines[0];
                }
            );

        this.stopService.stopsObserver$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data != undefined) {
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
                            for (let k = 0; k < data[0][i].length; k++) {
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
                            for (let k = 0; k < data[1][i].length; k++) {
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
                        //get date
                        let date = this.selectedReservation.date;
                        let dateString = ("0" + date.dayOfMonth()).slice(-2) +
                            ("0" + date.monthValue()).slice(-2) +
                            date.year();
                        let lt: LocalTime = null;
                        if (this.selectedReservation.direction == 'OUTWARD') {
                            lt = stop.outward[this.selectedReservation.tripIndex];
                        } else {
                            lt = stop.back[this.selectedReservation.tripIndex];
                        }

                        let time = "[" + ("0" + lt.hour()).slice(-2) + ":" + ("0" + lt.minute()).slice(-2) + "]";
                        let dialogRef = this.dialog.open(BookingDialog, {
                            panelClass: "reservation-dialog",
                            data: {
                                line: this.selectedLine.name,
                                stop: stop.name,
                                index: this.selectedRun,
                                reservation: this.selectedReservation,
                                time: time,
                                date: dateString
                            }
                        });

                        dialogRef.afterClosed().subscribe(result => {
                            this.reservationsService.closePopup();
                            if (result != undefined) {
                                if(result) {
                                    this.openSnackbar("Operazione completata con successo");
                                    this.reservationsService.buildReservations(this.viewDate, this.selectedChild.id);
                                    this.selectedReservation = undefined;
                                    this.today = false;
                                    this.selectedLine = this.lines[0];
                                    this.selectedRun = 0;
                                }else{
                                    this.openSnackbar("Qualcosa è andato storto, riprovare più tardi")
                                }
                            }
                        })
                    }
                }
            )
    }

    onPageResize(){
        this.mobile = this.isMobile();
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

    start = 0;
    refresh: Subject<any> = new Subject();

    mobile: boolean = false;
    today: boolean = false;

    isMobile(): boolean{
        if(window.innerWidth<800){
            this.view = CalendarView.Day;
            return true;
        }
        else{
            this.viewDate = this.getMonday(this.viewDate);
            if(this.selectedChild!=null) {
                this.reservationsService.buildReservations(this.viewDate, this.selectedChild.id);
            }
            this.view = CalendarView.Week;
            return false;
        }
    };

    changedDate() {
        let temp = this.getMonday(this.viewDate);
        if (temp != this.viewDate && this.view==CalendarView.Week) {
            this.viewDate = temp;
        }
        this.reservationsService.buildReservations(this.viewDate, this.selectedChild.id);
        this.selectedReservation = undefined;
        this.today = false;
        this.selectedLine = this.lines[0];
        this.selectedRun = 0;
    }


    getMonday(d: Date) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


    mouseDown($event, element: Reservation) {
        if (element.color == 'GRAY')
            return;
        this.opening = true;
        this.timestamp = $event.timeStamp;
    }

    mouseMove($event, element: Reservation) {
        if (!this.opening || element.color == 'GRAY')
            return;
        if ($event.timeStamp - this.timestamp >= 1000 && element.booked) {
            //long tap
            this.opening = false;
            this.selectedReservation = element;
            this.today = element.date.isEqual(LocalDate.now());
            this.selectedLine = this.lines.filter((value) => value.name == this.selectedReservation.lineName)[0];
            this.selectedRun = this.selectedReservation.tripIndex;
            return;
        }
    }

    mouseUp($event, element) {
        if (!this.opening || element.color == 'GRAY')
            return;
        this.opening = false;

        if ($event.timeStamp - this.timestamp >= 1000 && element.booked) {
            //long tap
            this.selectedReservation = element;
            this.today = element.date.isEqual(LocalDate.now());
            this.selectedLine = this.lines.filter((value) => value.name == this.selectedReservation.lineName)[0];
            this.selectedRun = this.selectedReservation.tripIndex;
        } else {
            //click
            if (!element.booked) {
                //element not booked
                let dateString = ("0" + element.date.dayOfMonth()).slice(-2) +
                    ("0" + element.date.monthValue()).slice(-2) +
                    element.date.year();
                if (this.reservationsService.defaultStop == undefined) {
                    //no default stops
                    this.openSnackbar("Nessuna fermata di default trovata. Selezionare la fermata manualmente");
                    this.selectedReservation = element;
                    this.today = element.date.isEqual(LocalDate.now());
                    this.selectedLine = this.lines[0];
                    this.selectedRun = 0;
                } else {
                    //default stops available
                    if(element.date.isEqual(LocalDate.now()) && element.default_stop_time.isBefore(LocalTime.now())){
                        //default stop not bookable
                        this.openSnackbar("Corsa partita. Impossibile prenotare fermata di default, selezionarne un'altra");
                        this.selectedReservation = element;
                        this.today = element.date.isEqual(LocalDate.now());
                        this.selectedLine = this.lines[0];
                        this.selectedRun = 0;
                    }else
                        //book default
                        this.reservationsService.reserveDefault(dateString, this.selectedChild.id, element.direction, element.date.isEqual(LocalDate.now()))
                            .subscribe(() => {
                                //success
                                this.reservationsService.buildReservations(this.viewDate, this.selectedChild.id);
                                this.openSnackbar("Prenotazione inserita con successo");
                            }, () => {
                                this.openSnackbar("Qualcosa è andato storto. Per favore riprovare più tardi.");
                            });
                }
            } else {
                //remove reservation
                this.reservationsService.removeReservation(element).subscribe(() => {
                    this.reservationsService.buildReservations(this.viewDate, this.selectedChild.id);
                    this.reservationsService.buildReservations(this.viewDate, this.selectedChild.id);
                    this.openSnackbar("Prenotazione rimossa con successo");
                }, () => {
                    this.openSnackbar("Qualcosa è andato storto. Per favore riprovare più tardi.");
                });
            }
        }
    }

    openSnackbar(message: string, duration = 3000) {
        this._snackBar.open(message, "OK", {
            duration: duration
        });
    }

    updateLine() {
        this.selectedRun = 0;
        this.setStops(this.previousWidth);
    }
}

export interface BookingData {
    line: string;
    date: string;
    stop: string;
    index: number;
    time: string;
    reservation: Reservation;
}

@Component({
        selector: 'booking-dialog-template',
        templateUrl: './booking-dialog.template.html',
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)

export class BookingDialog implements OnInit, OnDestroy {
    status = "dialog";

    errorMsg = null;

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

    constructor(
        private reservationsService: ReservationsService,
        @Inject(MAT_DIALOG_DATA) public data: BookingData,
        private cd: ChangeDetectorRef,
        public dialogRef: MatDialogRef<BookingDialog>) {
    }

    closeDialog(result) {
        return this.dialogRef.close(result);
    }

    book() {
        this.status = "request";
        this.reservationsService.reserve(this.data.line, this.data.date, this.data.reservation.childId, this.data.stop, this.data.reservation.direction, this.data.index)
            .subscribe(() => {
                    //success
                    this.status = "completed";
                    this.closeDialog(true);
                }, () => {
                    this.status = "completed";
                    this.closeDialog(false);
                }
            );
    }

    update() {
        this.status = "request";
        this.reservationsService.updateReservation(this.data.line, this.data.date, this.data.stop, this.data.index, this.data.reservation)
            .subscribe(() => {
                    //success
                    this.status = "completed";
                    this.closeDialog(true);
                }, () => {
                    this.status = "completed";
                    this.closeDialog(false);
                }
            );
    }
}
