import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stop-row',
  templateUrl: './stop-row.component.html',
  styleUrls: ['./stop-row.component.scss']
})
export class StopRowComponent implements OnInit {

  icon = "dot";

  children = [
    {
      "name": "Pazzo",
      "hadReservation": true,
      "isPresent": true
    },
    {
      "name": "Pezzo",
      "hadReservation": true,
      "isPresent": true
    },
    {
      "name": "Pizzo",
      "hadReservation": true,
      "isPresent": false
    },
    {
      "name": "Pozzo",
      "hadReservation": false,
      "isPresent": true
    },
    {
      "name": "Puzzo",
      "hadReservation": false,
      "isPresent": false
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
