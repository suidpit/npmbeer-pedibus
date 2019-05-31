import {LocalTime} from "js-joda";

export class Stop{
  private _name: string;
  private _time: LocalTime;
  private _position: {};

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
}
