export class Line {

  private _lineName;
  private _id;
  private _adminEmail;

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

}
