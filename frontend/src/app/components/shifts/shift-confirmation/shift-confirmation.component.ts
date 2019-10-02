import {Component, OnInit, ViewChild} from '@angular/core';
import {ShiftService} from "../../../services/shift/shift.service";
import {Observable} from "rxjs/internal/Observable";
import {of} from "rxjs/internal/observable/of";
import {Shift} from "../../../models/shift";
import {map, tap} from "rxjs/operators";
import {promise} from "selenium-webdriver";
import checkedNodeCall = promise.checkedNodeCall;
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {Data} from "@angular/router";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-shift-confirmation',
  templateUrl: './shift-confirmation.component.html',
  styleUrls: ['./shift-confirmation.component.scss']
})
export class ShiftConfirmationComponent implements OnInit {

  columnsToDisplay = [
    "lineName",
    "direction",
    "date",
    "startsAt",
    "companion",
    "visualized",
    "open",
    "select"
  ];

  dataSource: MatTableDataSource<DataHolder>;
  @ViewChild("paginator", {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  n = 0;

  constructor(public shiftService: ShiftService, private auth: AuthService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.setup();
  }

  setup(){
    this.shiftService.buildUpcomingEvents();
    this.shiftService.getShifts().subscribe((shifts)=>{
      let arr = [];
      for(let s of shifts){
        arr.push(new DataHolder(s, false, this.auth.getUsersDetails([s.companionId])));
      }
      this.dataSource = new MatTableDataSource<DataHolder>(arr);
      this.dataSource.sort = this.sort;

      // workaround for not working paginator
      setTimeout(() =>
        this.dataSource.paginator = this.paginator, 100);
    });
  }

  selectElement(element: DataHolder){
    element.checked = !element.checked;
    if(element.checked) this.n += 1;
    else this.n -= 1;
  }

  sortBy(event) {
    let column = event.active;
    let direction = event.direction;
    switch(column){
      case "lineName":
        this.dataSource.data.sort((a: DataHolder, b: DataHolder) =>{
          debugger;
          if(direction === "desc") return a.shift.lineName > b.shift.lineName?+1:-1;
          return a.shift.lineName > b.shift.lineName?-1:+1;
        });
        break;

      case "direction":
        this.dataSource.data.sort((a: DataHolder, b: DataHolder) =>{
          if(direction === "desc") return a.shift.direction > b.shift.direction?+1:-1;
          return a.shift.direction > b.shift.direction?-1:+1;
        });
        break;

      case "date":
        this.dataSource.data.sort((a: DataHolder, b: DataHolder) =>{
          if(direction === "desc") return a.shift.date.isBefore(b.shift.date)?+1:-1;
          return a.shift.date.isBefore(b.shift.date)?-1:+1;
        });
        break;

      case "startsAt":
        this.dataSource.data.sort((a: DataHolder, b: DataHolder) =>{
          if(direction === "desc") return a.shift.date.isBefore(b.shift.date)?+1:-1;
          return a.shift.date.isBefore(b.shift.date)?-1:+1;
        });
        break;

      case "open":
        this.dataSource.data.sort((a: DataHolder, b: DataHolder) => {
          if(direction === "desc") return a.shift.open?+1:-1;
          return a.shift.open?-1:+1;
        });
        break;
    }
  }

  submit(){
    let toSend = [];
    for(let s of this.dataSource.data){
      if(s.checked){
        s.shift.open = !s.shift.open;
        toSend.push(s.shift);
      }
    }
    this.shiftService.sendOpenCloseShifts(toSend).subscribe(()=>{
      this.n = 0;
      this.setup();
      this.openSnackbar("Turni salvati con successo.");
    },
      (err) => console.log(err));
  }


  openSnackbar(message: string, duration = 3000){
    this._snackBar.open(message, "OK", {
      duration: duration
    });
  }
}

export class DataHolder{
  public shift: Shift;
  public checked: boolean;
  public usersInfo$: Observable<User[]>;
  constructor(s: Shift, c: boolean, userInfo$: Observable<User[]>){
    this.shift = s;
    this.checked = c;
    this.usersInfo$ = userInfo$;
  }
}
