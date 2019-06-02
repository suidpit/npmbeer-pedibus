import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-stop-row',
  templateUrl: './stop-row.component.html',
  styleUrls: ['./stop-row.component.scss']
})
export class StopRowComponent implements OnInit {

  @Input("type") type = "end";

  @Input("stop-data") stop;

  @Output("child-presence") change: EventEmitter<Kid> = new EventEmitter<Kid>();

  icon = "dot";

  children = [
    new Kid("Pazzo", true, true),
    new Kid("Pezzo", true, true),
    new Kid("Pizzo", true, false),
    new Kid("Pozzo", false, true),
    new Kid("Puzzo", false, false)
  ];

  constructor() { }

  ngOnInit() {
  }

  togglePresence(child){
    child.isPresent = !child.isPresent;
    this.change.emit(child);
  }
}

export class Kid{
  name: string;
  hadReservation: false;
  isPresent: false;

  constructor(name, hadReservation, isPresent){
    this.name = name;
    this.hadReservation = hadReservation;
    this.isPresent = isPresent;
  }
}
