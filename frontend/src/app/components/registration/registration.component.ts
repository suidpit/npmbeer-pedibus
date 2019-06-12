import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material";
//import {DialogAddKid} from "../stop-row/stop-row.component";
import {ChangeDetectionStrategy, EventEmitter, Inject, Input, Output} from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
//import {Kid} from "../stop-row/stop-row.component";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  
  children = [];

  @Output("add-child") addChild: EventEmitter<KidReg> = new EventEmitter<KidReg>();

  @ViewChild("emailField", {static:true}) emailField : ElementRef;
  isLinear = false;
  error = false;
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  registerForm: FormGroup = this.fb.group({
    email: ["", [
      Validators.email,
      Validators.required]
    ],
    password1: ["", Validators.required],
    password2: ["", Validators.required]
  });
  ngOnInit() {
    this.emailFormGroup = this.fb.group({
      email: ["", [
        Validators.email,
        Validators.required]
      ]
    });
    this.passwordFormGroup = this.fb.group({
      password1: ["", Validators.required],
      password2: ["", Validators.required]
    });
  }

  ngAfterViewInit(){
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private dialog: MatDialog) {
  }



  onSubmit(){
    let self = this;
    this.auth.register(this.emailFormGroup.controls.email.value, 
      this.passwordFormGroup.controls.password1.value,
      this.passwordFormGroup.controls.password2.value)
      .subscribe( () => {
                          self.router.navigate(["/login"]);
                        },
                        () => {
                          self.error = true;
                          self.emailField.nativeElement.focus();
                        }
     );
  
  }
  emitChild(child){
    this.addChild.emit(child);
  }
  showPopup(){
    const self = this;
    const dialogRef = this.dialog.open(DialogAddKidReg, {
      width: "350px",
      data: { name: "", gender: ""}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result && result !== undefined){
        const child = {name: result.name};
        self.children.push(child);
        self.emitChild(child);
      }
    });
    
  }
  reset(){
    this.children = [];
  }
  moreChildren(){
    return this.children.length<3;
  }

}
export interface KidReg{
  name: string;
  hadReservation: false;
  isPresent: false;

  // constructor(name, hadReservation, isPresent){
  //   this.name = name;
  //   this.hadReservation = hadReservation;
  //   this.isPresent = isPresent;
  // }
}

export interface DialogAddKidDataReg {
  name: string;
  gender: string;
}

@Component({
  selector: 'add-kid-popup-reg-template',
  templateUrl: 'add-kid-popup-reg-template.html',
})
export class DialogAddKidReg {

  constructor(
    public dialogRef: MatDialogRef<DialogAddKidReg>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddKidDataReg) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
