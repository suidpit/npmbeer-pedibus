import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user";
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs/internal/Observable";
import {Role} from "../../models/authority";
import {MatSidenav} from "@angular/material";
import {ProfileService} from "../../services/profile/profile.service";
import {EventsService} from "../../services/events/events.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @ViewChild("sidenav", {static: true}) sidenav: MatSidenav;
  isAuthenticated: boolean;
  user: User;

  entries = [];

  user_entries = [
    {
      displayName: "Home",
      url: "/home",
      roles: [],
      icon: "home"
    },
    {
      displayName: "Kid Finder",
      url: "/trovaBambino",
      roles: [Role.USER],
      icon: "map"
    },
    {
      displayName: "Prenotazione",
      url: "/prenotazione",
      roles: [Role.USER],
      icon: "menu_book"
    },
    {
      displayName: "Notifiche",
      url: "/notifiche",
      roles: [Role.USER],
      icon: "list"
    }
  ];

  companion_entries = [
    {
      displayName: "Presenze",
      url: "/presenze",
      roles: [Role.COMPANION],
      icon: "check_circle_outline"
    },
    {
      displayName: "Turni",
      url: "/admin/turni",
      roles: [Role.COMPANION],
      icon: "calendar_today"
    }
  ];

  admin_entries = [
    {
      displayName: "Registrazione Utenti",
      url: "/registrazioneEmail",
      roles: [Role.ADMIN],
      icon: "person_add"
    }
    ];

  pic = null;
  not_read_n = 0;

  constructor(public auth: AuthService, private profileService: ProfileService, public eventService: EventsService) {}

  ngOnInit() {
    this.isAuthenticated = false;
    this.user = null;

    this.profileService.user$.subscribe((user)=>{
      if(user!=null)
        this.pic = user.photo;
      else
        this.pic = null;
    });

    this.auth.currentUser$.subscribe(
      (user) =>
      {
        this.user = user;
        this.isAuthenticated = user !== null && user !== undefined;
        this.entries = this.user_entries;

        if(this.isAuthenticated){
          if(this.auth.getCurrentUser().hasMinAuthority(Role.COMPANION)){
            this.entries = this.entries.concat(this.companion_entries);
          }
          if(this.auth.getCurrentUser().hasMinAuthority(Role.ADMIN)){
            this.entries = this.entries.concat(this.admin_entries);
          }
        }
      }
    )

    this.eventService.currentNotification.subscribe((notifications) => {
      if(notifications !== null && notifications !== undefined){
        this.not_read_n = notifications.filter(notification => !notification.read).length;
      }
    })
  }

  logout(){
    this.auth.logout();
    this.sidenav.toggle();
  }
}
