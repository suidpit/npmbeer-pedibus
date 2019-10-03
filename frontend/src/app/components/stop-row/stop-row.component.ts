import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material";
import {AttendanceService} from "../../services/attendance/attendance.service";
import {ProfileService} from "../../services/profile/profile.service";
import {Observable} from "rxjs/internal/Observable";
import {Child} from "../../models/child";
import {map, takeUntil} from "rxjs/operators";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {AuthService} from "../../services/auth/auth.service";
import {Subject} from "rxjs/index";


/**
 * This Component should have been DUMMY, however, unfortunately, it was developed when the concept of smart-dummy was
 * not really clear yet and for sure the angular coding skills weren't so high, therefore we now a beautiful
 * dummily-smart component. *sob*
 */

@Component({
  selector: 'app-stop-row',
  templateUrl: './stop-row.component.html',
  styleUrls: ['./stop-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopRowComponent implements OnInit, OnDestroy {

  @Input("type") type = "end";

  @Input("stop-name") stopName;

  @Input("stop-time") stopTime;

  @Input("children") children;

  @Input("direction") direction;

  @Input("tripIndex") tripIndex;

  @Input("stopIndex") stopIndex;

  @Input("not-reserved-kids") notReserved$: Observable<Child[]>;

  @Output("child-presence") change: EventEmitter<Kid> = new EventEmitter<Kid>();

  @Output("add-child") addChild: EventEmitter<Kid> = new EventEmitter<Kid>();

  icon = "dot";

  childrenInfoSubject  = new BehaviorSubject(null);
  childrenInfo$ = this.childrenInfoSubject.asObservable();

  private unsubscribe$ = new Subject<void>();

  constructor(private dialog: MatDialog, private profileService: ProfileService, private auth: AuthService) {
  }

  ngOnInit() {
    this.updateData();
  }

  updateData(){
    if(this.children != null){
      this.children.pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe((reservedStops)=>{
          this.childrenInfoSubject.next(null);
          if(reservedStops !== null && reservedStops[this.direction][this.tripIndex][this.stopIndex].length > 0){
            let kids = reservedStops[this.direction][this.tripIndex][this.stopIndex];
            let full_child_res_info = [];
            for(let info of kids){
              let child$ = this.profileService.getChildById(info.id);
              let obj = {hadReservation: info.companionWhoInserted==null, isPresent: info.isPresent,
                childId: info.id, child$: child$, resid: info.resid, name: info.name};
              full_child_res_info.push(obj);
            }

            full_child_res_info.sort((c1, c2) =>{
              if((c1.hadReservation && c2.hadReservation) || (!c1.hadReservation && !c2.hadReservation)){
                return c1.name < c2.name? -1:+1;
              }
              else if(c1.hadReservation && !c2.hadReservation) return -1;
              else return +1;
            });

            this.childrenInfoSubject.next(full_child_res_info);
          }
        });
    }
    /*
    if(this.children !== undefined && this.children !== null && this.children.length > 0){
      let full_child_res_info = [];
      for(let info of this.children){
        let child$ = this.profileService.getChildById(info.id);
        let obj = {hadReservation: info.companionWhoInserted==null, isPresent: info.isPresent,
                  childId: info.id, child$: child$, resid: info.resid};
        full_child_res_info.push(obj);
      }
      this.childrenInfoSubject.next(full_child_res_info);
    }
    */
  }

  togglePresence(childResInfo){
    childResInfo.isPresent = !childResInfo.isPresent;
    this.change.emit({
      isPresent: childResInfo.isPresent,
      hadReservation: childResInfo.hadReservation,
      id: childResInfo.id,
      resid: childResInfo.resid,
      stop: this.stopName});
  }

  emitChild(child){
    this.addChild.emit(child);
  }

  showPopup(){
    const self = this;
    const dialogRef = this.dialog.open(DialogAddKid, {
      width: "350px",
      data: {id: null, stop:self.stopName, child_list$:this.notReserved$}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== undefined && result.id !== null){
        const child = {
          id: result.id,
          companionWhoInserted:this.auth.getCurrentUser().id,
          isPresent: true,
          resid: null,
          stop: this.stopName
        };
        self.emitChild(child);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

export interface Kid{
  id: string;
  hadReservation: false;
  isPresent: false;
  resid: string;
  stop: string;
  // constructor(name, hadReservation, isPresent){
  //   this.name = name;
  //   this.hadReservation = hadReservation;
  //   this.isPresent = isPresent;
  // }
}

export interface DialogAddKidData {
  id: string;
  stop: string;
  child_list$: Observable<Child[]>;
}

@Component({
  selector: 'add-kid-popup-template',
  templateUrl: 'add-kid-popup-template.html',
})
export class DialogAddKid {

  constructor(
    public dialogRef: MatDialogRef<DialogAddKid>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddKidData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void{
    debugger;
  }

}
