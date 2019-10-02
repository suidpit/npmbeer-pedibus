import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user";
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  isAuthenticated: boolean;
  user: User;

  entries = [
    {
      displayName: "Presenze",
      url: "/presenze",
      roles: []
    },
    {
      displayName: "Prenotazione",
      url: "/prenotazione",
      roles: []
    },
    {
      displayName: "Turni",
      url: "/admin/turni",
      roles: []
    },
    {
      displayName: "Registrazione Utenti",
      url: "/registrazioneEmail",
      roles: []
    },
    {
      displayName: "Eventi",
      url: "/eventi",
      roles: []
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
      }
    )
  }
}
