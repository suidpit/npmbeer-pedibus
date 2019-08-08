import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-imposta-password',
  templateUrl: './imposta-password.component.html',
  styleUrls: ['./imposta-password.component.scss']
})
export class ImpostaPasswordComponent implements OnInit {

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


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
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
      .subscribe( (res) => {
                          self.router.navigate(["/login"]);
                        },
                  (err) => {
                          if(err.status === 409){
                          }
                          self.error = true;
                          console.log("error in sendPassword")

                          //self.emailField.nativeElement.focus();
                        }
                  // () => {
                  //      console.log("finally")
                  // }

     );

  }

}

export class MyErrorStateMatcherNew implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
