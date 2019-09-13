import {LocalTime} from "js-joda";
import * as deepEqual from "deep-equal";
import { Child } from "../models/child"

export class Stop{
  private _name: string;
  private _time: LocalTime;
  private _position: {};
  private _childs: Child[];

  get position(): {} {
    return this._position;
  }

  set position(value: {}) {
    this._position = value;
  }
  set time(value: LocalTime) {
    this._time = value;
  }
  get time(): LocalTime {
    return this._time;
  }
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  // Temporary mockup
  set childs(value: Child[]) {
    this._childs = value;
  }

  get childs() {
    return this._childs;
  }

  public compareTo(stop: Stop){
    if(!(this._name === stop.name)) return false;
    if(!(this._time === stop.time)) return false;
    if(!deepEqual(this._position, stop.position)) return false;
    return true;
  }
}
