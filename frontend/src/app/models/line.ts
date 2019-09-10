import {Stop} from "./stop";
import {StopList} from "./stop-list";

export class Line {
  name;
  id;
  admin_email;
  outward: Array<StopList>;
  back: Array<StopList>;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
