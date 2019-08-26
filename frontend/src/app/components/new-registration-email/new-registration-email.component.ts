import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-registration-email',
  templateUrl: './new-registration-email.component.html',
  styleUrls: ['./new-registration-email.component.scss']
})
export class NewRegistrationEmailComponent implements OnInit {
  @ViewChild("emailField", {static:true}) emailField : ElementRef;
  editEmail(): void {this.emailField.nativeElement.focus();}
  isLinear = true;
  error = false;
  emailFormGroup = this.fb.group({
    email: ["", [
      Validators.email,
      Validators.required,
      Validators.pattern("")]
    ]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private dialog: MatDialog) { }

  ngOnInit() {
    this.emailFormGroup = this.fb.group({
      email: ["", [
        Validators.email,
        Validators.required,
        this.emailValidator]
      ]
    });
  }
  emailValidator(): ValidatorFn {  
    return (c: FormControl) => {  
     let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(c.value);  
     if (isValid) {  
      return null;  
     } else {  
      return {  
       emailvalidator: {  
        valid: false  
       }  
      };  
     }  
    }  
   } 
  ngAfterViewInit(){
  }
onSubmit(){
//debugger
//     next: (res) => /*callback per successo*/,
// err: (err) => /*callback per errore*/,
// final: (res) => /*callback da eseguire per ultima come nel blocco finally*/
    let self = this;
    this.auth.registerEmail(this.emailFormGroup.controls.email.value)
      .subscribe( (res) => {
                          self.showPopupEmailSended();
                          self.router.navigate(["/login"]);
                        },
                  (err) => {
                          if(err.status === 409){
                            self.showPopupEmailExists();
                            self.emailFormGroup.controls.email.setErrors({"exists": true})
                          }
                          else if(err.status === 403){
                            console.log("%cAzione proibita","color:red");

                          }
                          self.error = true;

                          //self.emailField.nativeElement.focus();
                        },
                  // () => {
                  //      console.log("finally")
                  // }

     );
     console.log(this.emailFormGroup.controls.email.value);


}
  showPopupEmailSended(){
    const self = this;
    const dialogRef = this.dialog.open(DialogEmailSendedNewReg, {
      width: "350px",
      data: { }
    });
  }

  showPopupEmailExists(){
    const self = this;
    const dialogRef = this.dialog.open(DialogEmailExistsNewReg, {
      width: "350px",
      data: { }
    });
  }



  get email(){
    return this.emailFormGroup.get('email');
  }
  getErrorMessage() {
    return this.email.hasError('required') ? 'Devi riempire questo campo' :
        this.email.hasError('email') ? 'Inserisci una email valida' :
            this.email.hasError("exists")? "Questa mail è già stata utilizzata per un altro account":"";
  }

}

@Component({
  selector: 'email-sended-template',
  templateUrl: 'email-sended-template.html',
})
export class DialogEmailSendedNewReg {

  constructor(
    public dialogRef: MatDialogRef<DialogEmailSendedNewReg>,
    @Inject(MAT_DIALOG_DATA) public data: null) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'email-existing-popup-template',
  templateUrl: 'email-existing-popup-template.html',
})
export class DialogEmailExistsNewReg {

  constructor(
    public dialogRef: MatDialogRef<DialogEmailExistsNewReg>,
    @Inject(MAT_DIALOG_DATA) public data: null) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
