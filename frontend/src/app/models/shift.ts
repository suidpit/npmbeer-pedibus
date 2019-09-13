import {LocalDateTime, LocalTime} from "js-joda";
import {User} from "./user";
import {Stop} from "./stop";

export class Shift {

  id: string;
  dateAndTime: LocalDateTime;
  lineName: string;
  direction: string;
  tripIndex: number;
  availabilities: User[];
  open: boolean = true;
  companionId: string;
  startsAt: LocalTime;
  endsAt: LocalTime;
  from: Stop;
  to: Stop;
  color: string;  // color to use in calendar
  classNames: string[];  // css classes to use in calendar

  public compareTo(shift: Shift){
    if(this.id === shift.id) return true;
    if(!this.dateAndTime.isEqual(shift.dateAndTime)) return false;
    if(!(this.lineName === shift.lineName)) return false;
    if(!(this.direction === shift.direction)) return false;
    if(!(this.tripIndex === shift.tripIndex)) return false;
    if(!this.from.compareTo(shift.from)) return false;
    if(!this.to.compareTo(shift.to)) return false;
    return true;
  }
}
