import {LocalDate, LocalDateTime, LocalTime} from "js-joda";
import {User} from "./user";
import {Stop} from "./stop";
import {Observable} from "rxjs/internal/Observable";
import {IGeoJsonObject} from "./igeojson-object";
import {Local} from "protractor/built/driverProviders";

export class Shift {

  id: string;
  date: LocalDate;
  lineName: string;
  direction: string;
  tripIndex: number;
  defaultCompanion: string;
  availabilities: Observable<User[]>;
  open: boolean = true;
  companionId: string;
  startsAt: LocalTime;
  endsAt: LocalTime;
  from: String;
  to: String;
  color: string;  // color to use in calendar
  classNames: string[];  // css classes to use in calendar
  disabled: boolean = false;
  subscribed: boolean = false;
  latestUpdate: IGeoJsonObject = null;

  public compareTo(__shift: Shift){
    if(this.id !== undefined && __shift.id !== undefined && this.id === __shift.id) return true;
    if(!this.date.isEqual(__shift.date)) return false;
    if(!(this.lineName === __shift.lineName)) return false;
    if(!(this.direction === __shift.direction)) return false;
    if(!(this.tripIndex == __shift.tripIndex)) return false;
    //if(!this.from.compareTo(__shift.from)) return false;
    //if(!this.to.compareTo(__shift.to)) return false;
    return true;
  }
}
