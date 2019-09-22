import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user';
import { FormBuilder, ValidatorFn, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lateralmenu',
  templateUrl: './lateralmenu.component.html',
  styleUrls: ['./lateralmenu.component.css']
})
export class LateralmenuComponent implements OnInit  {
 
  isAuthenticated: boolean;
  user = null;
  userInfo ;
  task = null;
  email :Observable<string>
  name;surname;address;telephone;
  form:FormGroup;
  
   onSubmit(){
   console.log(this.form.value)
   this.auth.editProfileInformation(this.user['_email'],this.form.controls.nameDopo.value,
                                    this.form.controls.surnameDopo.value,
                                    this.form.controls.addressDopo.value,
                                    this.form.controls.telephoneDopo.value).subscribe(
     (res) => {
       console.log(res);
     }
   )
    }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,public auth: AuthService,private fb: FormBuilder) {
    this.form = this.fb.group({
      nameDopo: [],
      surnameDopo: [],
      addressDopo: [],
      telephoneDopo: []
    })
  }
  
  selectTaskBambini(){
    console.log("Bambini")
    this.task = "bambini";
  }
  selectTaskProfilo(){
    this.task="profilo"
    console.log(this.user)

    this.auth.getProfileinformation(this.user).subscribe(
      (res) =>{
      console.log(res);
      //this.email = res['email'];
      this.name = (res['name']);
      this.surname = (res['surname']);
      this.address = (res['address']);
      this.telephone = (res['telephone']);


    })

  }
  selectTaskCambioPassword(){
    this.task = "cambioPwd";
  }

}

