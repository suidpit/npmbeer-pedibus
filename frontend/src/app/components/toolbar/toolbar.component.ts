import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user";
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs/internal/Observable";
import {Role} from "../../models/authority";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  isAuthenticated: boolean;
  user: User;

  entries = [];

  user_entries = [
    {
      displayName: "Home",
      url: "/home",
      roles: []
    },
    {
      displayName: "Kid Finder",
      url: "/trovaBambino",
      roles: [Role.USER]
    },
    {
      displayName: "Prenotazione",
      url: "/prenotazione",
      roles: [Role.USER]
    }
  ];

  companion_entries = [
    {
      displayName: "Presenze",
      url: "/presenze",
      roles: [Role.COMPANION]
    },
    {
      displayName: "Turni",
      url: "/admin/turni",
      roles: [Role.COMPANION]
    }
  ];

  admin_entries = [
    {
      displayName: "Registrazione Utenti",
      url: "/registrazioneEmail",
      roles: [Role.ADMIN]
    }
    ];
  constructor(public auth: AuthService) {
  }

  ngOnInit() {
    this.isAuthenticated = false;
    this.user = null;

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
  }
}
