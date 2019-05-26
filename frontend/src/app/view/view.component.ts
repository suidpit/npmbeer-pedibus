import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data/data.service';
import {IReservation} from '../interfaces/reservations';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

public reservations = [];
public users = [];
public lines = [];

  constructor(private _service: DataService) { }

  ngOnInit() {
    this._service.getReservation()
    .subscribe(data => this.reservations = data );
    this._service.getUsers()
    .subscribe(data => this.users = data );
    this._service.getLines()
    .subscribe(data => this.lines = data );

  }

}
