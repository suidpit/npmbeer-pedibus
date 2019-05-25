import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data/data.service";
import {MatSelect} from "@angular/material";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  selectedLine = null;
  lines = null;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.getLines().subscribe(lines => {
      this.selectedLine = lines[1];
      return this.lines = lines;
    });
  }

}
