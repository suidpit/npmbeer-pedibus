import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-stop-row',
  templateUrl: './stop-row.component.html',
  styleUrls: ['./stop-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopRowComponent implements OnInit {

  @Input("type") type = "end";

  @Input("stop-name") stopName;

  @Input("stop-time") stopTime;

  @Input("children") children;

  @Output("child-presence") change: EventEmitter<Kid> = new EventEmitter<Kid>();

  icon = "dot";

  constructor() {
    console.log("ahahah");
  }

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
