import {Stop} from "./stop";
import {LocalTime} from "js-joda";
import {Builder} from "builder-pattern";

/**
 * Comfort class which holds the starting time for a certain series of Stops
 * **/
export class StopList {

    private _stops: Stop[];
    private _startsAt: LocalTime[][];
    private _endsAt: LocalTime[][];

    get startsAt(): LocalTime[][] {
        return this._startsAt;
    }

    get endsAt(): LocalTime[][] {
        return this._endsAt;
    }

    set startsAt(time : LocalTime[][]){
        this._startsAt = time;
    }

    set endsAt(time : LocalTime[][]){
        this._endsAt = time;
    }

    get stops(): Stop[] {
        return this._stops;
    }

    /**
     * Sets Stop AND startsAt/endsAt values, basing on the stops themselves
     * **/
    set stops(value: Stop[]) {
        let outs = 0;
        let backs = 0;
        if (value.length > 0) {
            outs = value[0].outward.length;
            backs = value[0].back.length;
        }
        this.startsAt = [];
        this.endsAt = [];
        let minTime_back = [];
        let minTime_out = [];
        let maxTime_back = [];
        let maxTime_out = [];
        for (let i = 0; i < outs; i++) {
            minTime_out.push(LocalTime.of(23, 59, 59));
            maxTime_out.push(LocalTime.of(0, 0, 0));
        }
        for (let j = 0; j < backs; j++) {
            minTime_back.push(LocalTime.of(23, 59, 59));
            maxTime_back.push(LocalTime.of(0, 0, 0));
        }
        for (let stop of value) {
            for (let i = 0; i < outs; i++) {
                minTime_out[i] = minTime_out[i].isBefore(stop.outward[i]) ? minTime_out[i] : stop.outward[i];
                maxTime_out[i] = maxTime_out[i].isAfter(stop.outward[i]) ? maxTime_out[i] : stop.outward[i];
            }
            for (let i = 0; i < backs; i++) {
                minTime_back[i] = minTime_back[i].isBefore(stop.back[i]) ? minTime_back[i] : stop.back[i];
                maxTime_back[i] = maxTime_back[i].isAfter(stop.back[i]) ? maxTime_back[i] : stop.back[i];
            }
        }
        this._startsAt.push(minTime_out);
        this._startsAt.push(minTime_back);
        this._endsAt.push(maxTime_out);
        this._endsAt.push(maxTime_back);
        this._stops = value;
    }


    constructor(values: any = {}) {
        let stops = [];
        for(let v of values){
            stops.push(new Stop(v));
        }
        this.stops = stops;
    }
}
