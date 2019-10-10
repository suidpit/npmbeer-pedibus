import {
    Component,
    ElementRef,
    Input,
    ViewChild
} from '@angular/core';
import {StopService} from "../../../services/stop/stop.service";
import {ReservationsService} from "../../../services/reservations/reservations.service";

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
    @Input("time") time;
    @Input("selected_stop") selected_stop;

    constructor(private stopService: StopService, private reservationService: ReservationsService) {
        console.log(this.selected_stop);
    }

    selectStop() {
        this.reservationService.selectStop(this.stop);
    }

}
