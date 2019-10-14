import {Stop} from "./stop";
import {StopList} from "./stop-list";
import {Builder} from "builder-pattern";
import {LocalTime} from "js-joda";

export class Line {
  name;
  id;
  admin_email;
  stops: StopList;

  constructor(values: any = {}) {
    this.name = values.name;
    this.id = values.id;
    this.admin_email = values.admin_email;
    this.stops = new StopList(values.stops);
  }
}
