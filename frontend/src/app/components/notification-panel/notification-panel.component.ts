import {Component, NgZone, OnInit} from '@angular/core';
import {EventsService} from "../../services/events/events.service";

@Component({
  selector: 'notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent implements OnInit {
  notifications = [];
  constructor(private _eventsService: EventsService, private _zone: NgZone) { }

  ngOnInit() {
    this._eventsService.getServerSentEvent('http://192.168.99.100:8080/events/stream').subscribe({
      next: notification => {
        this._zone.run(() => {
          this.notifications.push(notification)
        })
      },
      error: err => console.log(err)
    });
  }

  onNotClick(notification) {
    this._eventsService.setNotificationRead(notification.id).subscribe((result) => {
      this.notifications = this.notifications.filter((notific) => notific !== notification.id)
    });
  }

}
