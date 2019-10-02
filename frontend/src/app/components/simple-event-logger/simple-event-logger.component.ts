import { Component, OnInit, NgZone } from '@angular/core';
import {EventsService} from "../../services/events/events.service";
import {Observable} from "rxjs";
import {Event} from "../../models/event";

@Component({
  selector: 'app-simple-event-logger',
  templateUrl: './simple-event-logger.component.html',
  styleUrls: ['./simple-event-logger.component.scss']
})
export class SimpleEventLoggerComponent implements OnInit {
  private events: Event[] = [];
  constructor(private _eventsService: EventsService, private _zone: NgZone) { }

  ngOnInit() {
    console.log("Heeey")
    this._eventsService.getServerSentEvent('http://localhost:8080/events/stream').subscribe({
      next: event => {
        this._zone.run(() => {
          console.log(event.body)
          this.events.push(event)
        })
      },
      error: err => console.log(err)
    });
  }
}
