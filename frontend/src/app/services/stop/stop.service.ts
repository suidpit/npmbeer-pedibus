import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StopService {

    stops_observer$: Subject<any[][]> = new BehaviorSubject(undefined);

    dummy_observer$: Subject<any> = new BehaviorSubject(undefined);

    updateDummy(dummy_stop) {
        this.dummy_observer$.next(undefined);
        this.dummy_observer$.next(dummy_stop);
    }

    initialize(stops, dot, width) {
        this.stop_rows_temp = [];
        this.stop_rows_temp.push([]);
        this.width = width;
        this.available = this.width;
        this.stops = stops;
        this.stop_rows_temp = [];
        this.dot = dot;
        this.updateDummy(dot);
    }

    stop_rows_temp = [];
    width = undefined;
    available = undefined;
    stops = [];
    stops_info = new Map();
    dot = undefined;
    dots_size = undefined;

    updateRows() {
        this.stop_rows_temp = [];
        for (let i = 0; i < this.stops.length; i++) {
            this.available = this.width - this.dots_size;
            this.stop_rows_temp.push([]);
            this.stop_rows_temp[i].push([]);
            for (let s of this.stops[i]) {
                if (this.available - this.stops_info.get(s) <= 0 &&
                    (
                        (this.stop_rows_temp[i][this.stop_rows_temp[i].length - 1].length > 1)
                    )) {
                    while (this.available - this.dots_size >= 0) {
                        this.stop_rows_temp[i][this.stop_rows_temp[i].length - 1].push({startOrEnd: 'dots'});
                        this.available -= this.dots_size;
                    }
                    this.stop_rows_temp[i].push([]);
                    this.available = this.width - this.dots_size;
                }
                this.stop_rows_temp[i][this.stop_rows_temp[i].length - 1].push(s);
                this.available -= this.stops_info.get(s);
            }
        }
        if(this.stop_rows_temp.length==0){
            this.stops_observer$.next(undefined);
        }else{
            this.stops_observer$.next(this.stop_rows_temp);
        }
    }

    setWidths(width, dummy_stop) {
        if (dummy_stop == this.dot) {
            if (this.dots_size == undefined) {
                this.dots_size = width;
            }
        } else if (this.stops_info.get(dummy_stop) == undefined) {
            if (dummy_stop.startOrEnd)
                this.stops_info.set(dummy_stop, (width));
            else
                this.stops_info.set(dummy_stop, (width + this.dots_size));

        }

        for (let i of this.stops) {
            for (let s of i) {
                if (this.stops_info.get(s) == undefined) {
                    this.updateDummy(s);
                    return;
                }
            }
        }
        this.updateDummy(undefined);
        this.updateRows();
    }
}
