import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  @ViewChild("emailField", {static:true}) emailField : ElementRef;

  error = false;

  registerForm: FormGroup = this.fb.group({
    email: ["", [
      Validators.email,
      Validators.required]
    ],
    password1: ["", Validators.required],
    password2: ["", Validators.required]
  });

  ngAfterViewInit(){
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(){
    let self = this;
    this.auth.register(this.registerForm.controls.email.value, 
      this.registerForm.controls.password1.value,
      this.registerForm.controls.password2.value)
      .subscribe( () => {
                          self.router.navigate(["/login"]);
                        },
                        () => {
                          self.error = true;
                          self.emailField.nativeElement.focus();
                        }
     );
  
  }

}
