import {
    Component,
    ElementRef,
    Input,
    ViewChild
} from '@angular/core';
import {StopService} from "../../../services/stop/stop.service";
import {ReservationsService} from "../../../services/reservations/reservations.service";
import {LocalTime} from "js-joda";

@Component({
    selector: 'app-stop-element',
    templateUrl: './stop-element.component.html',
    styleUrls: ['./stop-element.component.scss']
})
export class StopElementComponent{

    @Input("stop") stop;
    @ViewChild("container", {static: false}) container: ElementRef;
    @Input("selected") selected;
    @Input("type") type;
    @Input("time") time: LocalTime;
    @Input("selected_stop") selected_stop;
    @Input("today") today;
    now = LocalTime.now();

    constructor(private stopService: StopService, private reservationService: ReservationsService) {
    }

    selectStop() {
        this.reservationService.selectStop(this.stop);
    }

}
