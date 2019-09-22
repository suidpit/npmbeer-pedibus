import {Stop} from "./stop";
import {StopList} from "./stop-list";

export class Line {
  name;
  id;
  adminEmail;
  outward: Array<StopList>;
  back: Array<StopList>;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
