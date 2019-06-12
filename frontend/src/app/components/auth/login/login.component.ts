import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("emailField", {static:true}) emailField : ElementRef;

  error = false;

  loginForm: FormGroup = this.fb.group({
    email: ["", [
      Validators.email,
      Validators.required]
    ],
    password: ["", Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
  }

  ngAfterViewInit(){
  }

  ngOnInit() {
  }

  onSubmit(){
    let self = this;
    this.auth.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).subscribe(
      () => {
        // successful login
        self.router.navigate(["/presenze"]);
      },
      () => {
        self.error = true;
        self.emailField.nativeElement.focus();
      }
    );
  }
}
