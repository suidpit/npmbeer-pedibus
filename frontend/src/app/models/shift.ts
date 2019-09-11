import {LocalDateTime, LocalTime} from "js-joda";
import {User} from "./user";

export class Shift {

  id: string;
  dateAndTime: LocalDateTime;
  lineName: string;
  direction: string;
  availabilities: User[];
  open: boolean = true;
  companionId: string;
  startsAt: LocalTime;
  endsAt: LocalTime;
  from: String;
  to: String;
  color: string;  // color to use in calendar
  classNames: string[];  // css classes to use in calendar
}
