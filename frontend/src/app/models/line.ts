import {Stop} from "./stop";
import {StopList} from "./stop-list";
import {Builder} from "builder-pattern";
import {LocalTime} from "js-joda";

export class Line {
  name;
  id;
  adminEmail;
  stops: StopList;

  constructor(values: any = {}) {
    this.name = values.name;
    this.id = values.id;
    this.adminEmail = values.adminEmail;
    this.stops = new StopList(values.stops);
  }
}
