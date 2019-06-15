import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective, NgForm, ValidatorFn} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, ErrorStateMatcher} from "@angular/material";
//import {DialogAddKid} from "../stop-row/stop-row.component";
import {ChangeDetectionStrategy, EventEmitter, Inject, Input, Output} from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { longStackSupport, fbind } from 'q';
//import {Kid} from "../stop-row/stop-row.component";

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit, AfterViewInit {

   
  children = [];
  errorMatcher = new CrossFieldErrorMatcher();
  matcher = new MyErrorStateMatcher();

  @Output("add-child") addChild: EventEmitter<KidReg> = new EventEmitter<KidReg>();

  @ViewChild("emailField", {static:true}) emailField : ElementRef;
  isLinear = false;
  error = false;
  emailFormGroup = this.fb.group({
    email: ["", [
      Validators.email,
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
    ]
  });
  passwordFormGroup = this.fb.group(
    {
    password: ['', [
        Validators.required,
        Validators.minLength(8)
        //,Validators.pattern(regExps.password)
    ]],
    confirmPassword: ['']
},
{validator: this.checkPasswords})

  ngOnInit() {
 
  this.emailFormGroup.get('email').setValidators(Validators.email);
  }

  get email(){
    return this.emailFormGroup.get('email');
  }
  
  //email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'Devi riempire questo campo' :
        this.email.hasError('email') ? 'Inserisci una email valida' :
            '';
  }
  ngAfterViewInit(){
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private dialog: MatDialog) {
    auth.logout();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.controls.password.value;
  let confirmPass = group.controls.confirmPassword.value;

  return pass === confirmPass ? null : { notSame: true }     
}

  onSubmit(){
    //debugger
//     next: (res) => /*callback per successo*/,
// err: (err) => /*callback per errore*/,
// final: (res) => /*callback da eseguire per ultima come nel blocco finally*/
    let self = this;
    this.auth.register(this.email.value, 
      this.passwordFormGroup.controls.password.value,
      this.passwordFormGroup.controls.confirmPassword.value)  
      .subscribe( (res) => {
                          console.log("success");
                          this.showPopupEmailSended();
                          self.router.navigate(["/login"]);
                        },
                  (err) => {
                          console.log("error"+ err)
                          self.error = true;
                          //self.emailField.nativeElement.focus();
                        },
                  // () => {
                  //      console.log("finally")
                  // }

     );
  
  }
  showPopupEmailSended(){
    const self = this;
    const dialogRef = this.dialog.open(DialogEmailSended, {
      width: "350px",
      data: { }
    });
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
  checkValid(){
    if(this.emailFormGroup.valid && this.passwordFormGroup.valid){
      return true
    }
    return false
  }

}

///FINE CLASSE
@Component({
  selector: 'email-sended-template',
  templateUrl: 'email-sended-template.html',
})
export class DialogEmailSended {

  constructor(
    public dialogRef: MatDialogRef<DialogEmailSended>,
    @Inject(MAT_DIALOG_DATA) public data: null) {}

  onNoClick(): void {
    this.dialogRef.close();
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



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}