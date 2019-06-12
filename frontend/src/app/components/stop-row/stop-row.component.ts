import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material";

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

  @Input("children") children;

  @Output("child-presence") change: EventEmitter<Kid> = new EventEmitter<Kid>();

  @Output("add-child") addChild: EventEmitter<Kid> = new EventEmitter<Kid>();

  icon = "dot";

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  togglePresence(child){
    child.isPresent = !child.isPresent;
    this.change.emit(child);
  }

  emitChild(child){
    this.addChild.emit(child);
  }

  showPopup(){
    const self = this;
    const dialogRef = this.dialog.open(DialogAddKid, {
      width: "350px",
      data: { name: "", gender: "", stop:self.stopName}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== undefined){
        const child = {name: result.name, hadReservation: false, isPresent: true};
        self.children.push(child);
        self.emitChild(child);
      }
    });
  }
}

export interface Kid{
  name: string;
  hadReservation: false;
  isPresent: false;

  // constructor(name, hadReservation, isPresent){
  //   this.name = name;
  //   this.hadReservation = hadReservation;
  //   this.isPresent = isPresent;
  // }
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
    @Inject(MAT_DIALOG_DATA) public data: DialogAddKidData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
