import {AfterViewChecked, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-stop-list-row',
    templateUrl: './stop-list-row.component.html',
    styleUrls: ['./stop-list-row.component.scss']
})


export class StopListRowComponent implements OnInit{

    @Input("stops") stops;
    @Input("direction") direction;
    @Input("no_top") no_top;
    @Input("no_bottom") no_bottom;
    @Input("times") times;

    ngOnInit(): void {
        if (this.direction == "end") {
            this.stops = this.stops.slice().reverse();
        }
    }

    align() {
        if(this.no_top){
            return this.direction
        }
        return 'space-around'
    }
}
