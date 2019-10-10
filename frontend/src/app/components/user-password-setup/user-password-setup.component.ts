import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-imposta-password',
  templateUrl: './user-password-setup.component.html',
  styleUrls: ['./user-password-setup.component.scss']
})
export class UserPasswordSetupComponent implements OnInit {

  matcher = new MyErrorStateMatcherNew();
  error = false;


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

checkPasswords(group: FormGroup) { // here we have the 'passwords' group
let pass = group.controls.password.value;
let confirmPass = group.controls.confirmPassword.value;
return pass === confirmPass ? null : { notSame: true }
}


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private activatedRoute: ActivatedRoute,private _snackBar: MatSnackBar) { }

  ngOnInit() {
   // this.auth.logout();
  }

   onSubmit(){
    //debugger
//     next: (res) => /*callback per successo*/,
// err: (err) => /*callback per errore*/,
// final: (res) => /*callback da eseguire per ultima come nel blocco finally*/
    let self = this;
    console.log(this.activatedRoute.snapshot.params['token']);
    //debugger;

    this.auth.sendPassword(
      this.passwordFormGroup.controls.password.value,
      this.passwordFormGroup.controls.confirmPassword.value,
      this.activatedRoute.snapshot.params['token'])
      .subscribe(
                  (data) => {
                          console.log("%cAttivazione account","color:green");
                          this.openSnackBar();

                          self.router.navigate(["/login"]);

                          //self.emailField.nativeElement.focus();
                        },
                  (error) => {
                    if(error==200){
                      console.log("%cAttivazione account","color:green");
                      this.openSnackBar();

                      self.router.navigate(["/login"]);
                    }else{
                      console.log("%cErrore codice:"  + error,"color:red");

                    }
                        }
                  // () => {
                  //      console.log("finally")
                  // }

     );

  }

  durationInSeconds = 5;
  openSnackBar() {
    this._snackBar.openFromComponent(PizzaPartyComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

}

@Component({
  selector: 'account-activated-snack-bar',
  templateUrl: 'account-activated-snack-bar.html',
  styles: [`
    .example-pizza-party {
      color: hotpink;
    }
  `],
})
export class PizzaPartyComponent {}


export class MyErrorStateMatcherNew implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
