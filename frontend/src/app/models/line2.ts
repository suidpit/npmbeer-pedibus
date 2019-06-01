import {Stop} from "./stop";
import {StopList} from "./stop-list";

export class Linee {
  private _id;
  private name;
  private outward: Array<StopList>;
  private back: Array<StopList>;
  private admin_email;
  private _class;
}
