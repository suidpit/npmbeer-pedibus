import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    ViewChild
} from '@angular/core';
import {Stop} from "../../../models/stop";
import {StopService} from "../../../services/stop/stop.service";
import {ReservationsService} from "../../../services/reservations/reservations.service";

@Component({
    selector: 'app-stop-element',
    templateUrl: './stop-element.component.html',
    styleUrls: ['./stop-element.component.scss']
})
export class StopElementComponent implements AfterViewChecked {

    @Input("stop") stop;
    @ViewChild("container", {static: false}) container: ElementRef;
    @Input("dummy") dummy;
    @Input("selected") selected;
    sent = false;

    constructor(private stopService: StopService, private reservationService: ReservationsService) {
    }

    selectStop() {
        this.reservationService.selectStop(this.stop);
    }


    ngAfterViewChecked(): void {
        if(this.dummy && this.container){
            let width = this.container.nativeElement.getBoundingClientRect().width;
            if(width>0 && !this.sent){
                this.sent = true;
                this.stopService.setWidths(width, this.stop);
            }
        }
    }
}
