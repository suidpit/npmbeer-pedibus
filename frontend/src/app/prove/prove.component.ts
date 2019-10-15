import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance/attendance.service';

@Component({
  selector: 'app-prove',
  templateUrl: './prove.component.html',
  styleUrls: ['./prove.component.scss']
})
export class ProveComponent implements OnInit {

  constructor(private resService: AttendanceService) { }

  ngOnInit() {
    this.showLines()
  }

  showLines() {
    this.resService.lines()
    .subscribe()
  }

}
