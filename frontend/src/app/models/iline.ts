import {Stop} from "./stop";
import {StopList} from "./stop-list";

export interface ILine {
    id: string;
    name : string;
    outward: Array<StopList>;
    back: Array<StopList>;
    admin_email : string;
    _class : string;
}