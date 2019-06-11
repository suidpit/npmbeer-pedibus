import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';

@Component({
  selector: 'app-prove',
  templateUrl: './prove.component.html',
  styleUrls: ['./prove.component.scss']
})
export class ProveComponent implements OnInit {

  constructor(private resService: ReservationsService) { }

  ngOnInit() {
    console.log("Initializing component!")
    this.showLines()
  }

  showLines() {
    this.resService.lines()
    .subscribe((data) => console.log(data))
  }

}
