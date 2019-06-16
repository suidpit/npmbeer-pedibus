import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material";
import { Child } from "../../models/child";
import { Builder } from "builder-pattern";
import { ReservationDTO } from 'src/app/models/reservationDTO';

@Component({
  selector: 'app-stop-row',
  templateUrl: './stop-row.component.html',
  styleUrls: ['./stop-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopRowComponent implements OnInit {

  @Input("type") type = "end";

  @Input("stop-name") stopName;

  @Input("stop-time") stopTime;

  @Input("direction") direction: string;

  @Input("trip-index") tripIndex;

  @Input("children") children: Child[];

  @Output("child-presence") change: EventEmitter<Child> = new EventEmitter<Child>();

  @Output("add-child") addChild: EventEmitter<ReservationDTO> = new EventEmitter<ReservationDTO>();

  icon = "dot";

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  togglePresence(child) {
    child.present = !child.present;
    this.change.emit(child);
  }

  emitChild(c: Child) {
    let res: ReservationDTO = Builder(ReservationDTO)
      .child(c.name)
      .stopName(this.stopName)
      .direction(this.direction.toUpperCase())
      .tripIndex(this.tripIndex)
      .booked(c.booked)
      .present(c.present)
      .build()
    console.log(res)
    this.addChild.emit(res);
  }

  showPopup() {
    const self = this;
    const dialogRef = this.dialog.open(DialogAddKid, {
      width: "350px",
      data: { name: "", gender: "", stop: self.stopName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== undefined) {
        let child: Child = Builder(Child)
          .name(result.name)
          .present(true)
          .booked(false)
          .resId("")
          .build();
        self.emitChild(child);
      }
    });
  }
}


export interface DialogAddKidData {
  name: string;
  gender: string;
  stop: string;
}

@Component({
  selector: 'add-kid-popup-template',
  templateUrl: 'add-kid-popup-template.html',
})
export class DialogAddKid {

  constructor(
    public dialogRef: MatDialogRef<DialogAddKid>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddKidData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}