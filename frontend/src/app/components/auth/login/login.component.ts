import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("emailField", {static:true}) emailField : ElementRef;

  error = false;
  return = "";

  loginForm: FormGroup = this.fb.group({
    email: ["", [
      Validators.email,
      Validators.required]
    ],
    password: ["", Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngAfterViewInit(){
  }

  ngOnInit() {
    let self = this;
    this.route.queryParams.subscribe((params) =>{
      self.return = params["returnUrl"] || "/home";
    })
  }

  onSubmit(){
    let self = this;
    this.auth.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).subscribe(
      () => {
        // successful login
        self.router.navigate([self.return]);
      },
      () => {
        self.error = true;
        self.emailField.nativeElement.focus();
      }
    );
  }
}
