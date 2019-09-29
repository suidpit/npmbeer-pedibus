import {Injectable, NgZone} from '@angular/core';
import {SseService} from "../sse/sse.service";
import {Observable} from "rxjs";
import {Event} from "../../models/event"

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private _zone: NgZone, private _sseService: SseService) { }

  getServerSentEvent(url: string): Observable<Event>{
    return new Observable<Event>((observer) => {
      const eventSource = this._sseService.getEventSource(url);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
}
