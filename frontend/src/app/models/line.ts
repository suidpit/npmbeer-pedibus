import {Stop} from "./stop";
import {StopList} from "./stop-list";

export class Line {

  private _lineName;
  private _id;
  private _adminEmail;
  private _outward: Array<StopList>;
  private _back: Array<StopList>;

  get adminEmail() {
    return this._adminEmail;
  }

  set adminEmail(value) {
    this._adminEmail = value;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }
  get lineName() {
    return this._lineName;
  }

  set lineName(value) {
    this._lineName = value;
  }

  get outward(): Array<StopList> {
    return this._outward;
  }

  set outward(value: Array<StopList>) {
    this._outward = value;
  }

  get back(): Array<StopList> {
    return this._back;
  }

  set back(value: Array<StopList>) {
    this._back = value;
  }
}
