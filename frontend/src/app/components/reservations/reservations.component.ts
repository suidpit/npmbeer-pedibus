import {
    AfterViewChecked,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {LocalTime} from "js-joda";
import {ReservationsService} from "../../services/reservations/reservations.service";
import {FormControl} from "@angular/forms";
import {StopService} from "../../services/stop/stop.service";
import {ResizedEvent} from "angular-resize-event";

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

    stops = [];
    lines = [];
    selectedLine = null;
    oldSelectedLine = null;
    selected_stop = {};

    selectedRun = 0;
    selectedDate = null;
    selectedDirection = "outward";

    stop_rows = undefined;
    dummy_stop = {};
    completed = false;
    dot = {startOrEnd: 'dot_left'};
    children = [];
    selectedChild = undefined;

    allowedDaysFilter = (d: Date): boolean => {
        let dayNum = d.getDay();
        return !(dayNum === 0);
    };

    constructor(private reservationsService: ReservationsService, private stopService: StopService) {
        this.selectedDate = new FormControl(new Date());
    }

    ngOnInit() {
        this.reservationsService.lines().subscribe(
            (lines) => {
                this.lines = lines;
                this.selectedLine = this.lines[0];
                this.updateData()
            }
        );

        this.reservationsService.children().subscribe(
            (children) => {
                this.children = children;
            }
        );
        this.stopService.stops_observer$.subscribe((data) => {
            this.completed = true;
            setTimeout(()=>{this.stop_rows = data});
        });
        this.stopService.dummy_observer$.subscribe((data) => {
            setTimeout(()=>{this.dummy_stop = data});
        });
        this.reservationsService.selected_stop_observer$.subscribe(
            (stop) => {
                this.selected_stop = stop;
            }
        )
    }

    updateData() {
        this.selected_stop = {};
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
                this.stop_rows = undefined;
                this.oldSelectedLine = this.selectedLine;
            }
        }
    }

    onResize(event: ResizedEvent) {
        if (this.selectedLine != null)
            this.setStops(event.newWidth);
    }

    setStops(width) {
        let temp_stops = [];
        for (let r of this.selectedLine.outward) {
            let temp = [];
            temp.push({startOrEnd: 'start'});
            temp = temp.concat(r.stops);
            temp.push({startOrEnd: 'end'});
            temp_stops.push(temp);
        }
        for (let r of this.selectedLine.back) {
            let temp = [];
            temp.push({startOrEnd: 'start'});
            temp = temp.concat(r.stops);
            temp.push({startOrEnd: 'end'});
            temp_stops.push(temp);
        }
        this.stopService.initialize(temp_stops, this.dot, width);
    }

    selectChild(child) {
        this.selectedChild = child;
    }
}
