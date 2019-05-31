import {Stop} from "./stop";
import {LocalTime} from "js-joda";
import {Local} from "protractor/built/driverProviders";

/**
 * Comfort class which holds the starting time for a certain series of Stops
 * **/
export class StopList {
  private _stops: Stop[];
  private _startsAt: LocalTime;
  private _endsAt: LocalTime;

  get startsAt(): LocalTime {
    return this._startsAt;
  }

  get endsAt(): LocalTime {
    return this._endsAt;
  }

  get stops(): Stop[] {
    return this._stops;
  }

  /**
   * Sets Stop AND startsAt/endsAt values, basing on the stops themselves
   * **/
  set stops(value: Stop[]) {
    let minTime = LocalTime.of(23, 59, 59);
    let maxTime = LocalTime.of(0, 0, 0);
    for(let stop of value){
      minTime = minTime.isBefore(stop.time)?minTime:stop.time;
      maxTime = maxTime.isAfter(stop.time)?maxTime:stop.time;
    }
    this._startsAt = minTime;
    this._endsAt = maxTime;
    this._stops = value;
  }

}
