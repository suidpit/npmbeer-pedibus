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

  user: User = null;
  template_styles = null;
  template: Observable<ElementRef>;

  constructor(private auth: AuthService) {
    this.auth.currentUser.subscribe(
      (user) =>
      {
        this.user = user;
      }
    )
  }

  ngOnInit() {
  }

}
