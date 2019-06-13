import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective, NgForm, ValidatorFn} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, ErrorStateMatcher} from "@angular/material";
//import {DialogAddKid} from "../stop-row/stop-row.component";
import {ChangeDetectionStrategy, EventEmitter, Inject, Input, Output} from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
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
  errors = errorMessages;
  errorMatcher = new CrossFieldErrorMatcher();

  @Output("add-child") addChild: EventEmitter<KidReg> = new EventEmitter<KidReg>();

  @ViewChild("emailField", {static:true}) emailField : ElementRef;
  isLinear = false;
  error = false;
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  // registerForm: FormGroup = this.fb.group({
  //   email: ["", [
  //     Validators.email,
  //     Validators.required]
  //   ],
  //   password1: ["", Validators.required],
  //   confirmPassword: ["", Validators.required]
  // });
  ngOnInit() {
    this.emailFormGroup = this.fb.group({
      email: ["", [
        Validators.email,
        Validators.required]
      ]
    });
    this.passwordFormGroup = this.fb.group(
      {
      password: ['', [
          Validators.required
          //,Validators.pattern(regExps.password)
      ]],
      confirmPassword: ['', Validators.required]
  },
  {validator: this.passwordValidator})
  }
  
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }
 passwordValidator(form: FormGroup) {
  const password: string = form.get('password').value; // get password from our password form control
  const confirmPassword: string = form.get('confirmPassword').value; // get password from our confirmPassword form control
    // const condition = form.get('password').value !== form.get('confirmPassword').value;

    // return condition ? { passwordsDoNotMatch: true} : null;
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      form.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
  ngAfterViewInit(){
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private dialog: MatDialog) {
  }



  onSubmit(){
    let self = this;
    this.auth.register(this.emailFormGroup.controls.email.value, 
      this.passwordFormGroup.controls.password1.value,
      this.passwordFormGroup.controls.confirmPassword.value)
      .subscribe( () => {
                          self.router.navigate(["/login"]);
                        },
                        () => {
                          console.log("error")
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
  checkValid(){
    if(this.emailFormGroup.valid && this.passwordFormGroup.valid){
      return true
    }
    return false
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


export class CustomValidators {
  /**
   * Validates that child controls in the form group are equal
   */
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
      const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
      const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value);
      return isValid ? null : { childrenNotEqual: true };
  }
}

/**
* Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
*/
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return control.parent.invalid && control.touched;
  }
}

/**
* Collection of reusable RegExps
*/
export const regExps: { [key: string]: RegExp } = {
 password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
};

/**
* Collection of reusable error messages
*/
export const errorMessages: { [key: string]: string } = {
  fullName: 'Full name must be between 1 and 128 characters',
  email: 'Email must be a valid email address (username@domain)',
  confirmEmail: 'Email addresses must match',
  password: 'Password must be between 7 and 15 characters, and contain at least one number and special character',
  confirmPassword: 'Passwords must match'
};


function passwordMatchValidator(g: FormGroup) {
  const password = g.get('password').value;
  const confirm = g.get('confirmPassword').value
  return password === confirm ? null : { mismatch: true };
}