import {Injectable, NgZone} from '@angular/core';
import {SseService} from "../sse/sse.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Event} from "../../models/event"
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private _zone: NgZone, private _sseService: SseService, private http: HttpClient) { }
  private notificationSource: BehaviorSubject<Event[]> = new BehaviorSubject(null);
  currentNotification: Observable<Event[]> = this.notificationSource.asObservable();

  notifications: Event[];

  getServerSentEvent(url: string): Observable<Event>{
    return new Observable<Event>((observer) => {
      const eventSource = this._sseService.getEventSource(url);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(JSON.parse(event.data));
          let notification = JSON.parse(event.data);
          this.notifications.push(notification);
          this.notificationSource.next(this.notifications);
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
    let obs = this.http.post(`http://192.168.99.100:8080/events/read`, notId);
    obs.pipe(take(1)).subscribe(() => {
      this.notifications.find(notification => notification.id === notId).read = true;
      this.notificationSource.next(this.notifications);
    });
    return obs;
  }
}
