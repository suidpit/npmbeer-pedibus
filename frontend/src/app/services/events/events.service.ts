import {Injectable, NgZone} from '@angular/core';
import {SseService} from "../sse/sse.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Event} from "../../models/event"
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private _zone: NgZone, private _sseService: SseService, private http: HttpClient) { }
  private notificationSource: BehaviorSubject<Event> = new BehaviorSubject(null)
  currentNotification = this.notificationSource.asObservable()

  getServerSentEvent(url: string): Observable<Event>{
    return new Observable<Event>((observer) => {
      const eventSource = this._sseService.getEventSource(url);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(JSON.parse(event.data));
          //this.notificationSource.next(JSON.parse(event.data))
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  setNotificationRead(notId: string): Observable<any> {
    return this.http.post(`http://localhost:8080/events/read`, notId);
  }
}
