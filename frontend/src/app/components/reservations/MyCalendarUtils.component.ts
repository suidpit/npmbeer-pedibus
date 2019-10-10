import {CalendarUtils, DateAdapter} from "angular-calendar";
import {
    CalendarEvent,
    getEventsInPeriod,
    GetWeekViewArgs,
    getWeekViewEventOffset,
    WeekView,
} from 'calendar-utils';
import {CalendarUtils as BaseCalendarUtils} from 'angular-calendar';
import {getWeekView} from 'calendar-utils';
import {getDayView, GetDayViewArgs, DayView} from 'calendar-utils';
import {Injectable} from "@angular/core";

@Injectable()
export class MyCalendarUtilsComponent extends BaseCalendarUtils {
    constructor(private dateAdapter2: DateAdapter) {
        super(dateAdapter2)
    }

    //order day calendar
    getDayView(args: GetDayViewArgs): DayView {
        const outwardEvents = args.events.filter(event => event.meta.reservation.direction === 'OUTWARD');
        const backEvents = args.events.filter(event => event.meta.reservation.direction === 'BACK');
        return getDayView(this.dateAdapter2, {
            ...args,
            events: [
                ...outwardEvents,
                ...backEvents
            ]
        })
    }

    //order week calendar
    getWeekView(args: GetWeekViewArgs): WeekView {

        const outwardEvents = args.events.filter(event => event.meta.reservation.direction === 'OUTWARD');
        const backEvents = args.events.filter(event => event.meta.reservation.direction === 'BACK');

        const outwardView = getWeekView(this.dateAdapter2, {
            ...args,
            events: outwardEvents,
        })
        const backView = getWeekView(this.dateAdapter2, {
            ...args,
            events: backEvents
        })

        return {
            ...backView,
            allDayEventRows: [
                ...outwardView.allDayEventRows,
                ...backView.allDayEventRows
            ]
        }

    }
}
