import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as moment from "moment";
import {not} from "rxjs/internal-compatibility";
import {User} from "../../models/user";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {mapEntry} from "@angular/compiler/src/output/map_util";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login_url = "http://localhost:8080/login";  // http://localhost:4200/backend/login";
  register_url = "http://localhost:8080/register";  
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    // TODO check jwt validity before loading user, if not call logout
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("user")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string){
    let self = this;
    return this.http.post<any>(this.login_url, {"email": email, "password": password}).pipe(
      map( user => {
        return self.setSession(user)
      })
    );
    /*return this.http.post<any>(this.login_url, {"email": email, "password": password}).subscribe(
      res => {
        self.setSession(res);
      }, (err) => null );*/
  }
  register(email: string, pass:string, repass:string){
    let self = this;
    console.log(email + pass + repass)
    return this.http.post<any>(this.register_url, {"email" : email, "pass" : pass, "repass" : repass}).pipe(
      map( user => {
        return self.setSession(user)
      })
    );
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token_id");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("not_before");
    this.currentUserSubject.next(null);
  }

  isLoggedIn(){
    return moment().isBefore(this.getExpiration());
  }

  getCurrentUser(): User{
    return this.currentUserSubject.value;
  }

  getExpiration(){
    const expirationDate = localStorage.getItem("expires_at");
    return moment(expirationDate);
  }

  setSession(authResult){
    const arr = authResult["jwt"].split(".");
    const userInfo = JSON.parse(atob(arr[1]));
    const exp = userInfo["exp"];
    const nbf = userInfo["nbf"];

    let user = new User(userInfo["user_id"], userInfo["email"]);
    this.currentUserSubject.next(user);

    // add seconds to moment 0 ( 1 Jan 1970 00:00:00)
    const expiresAt = moment(0).add(exp, "second");
    const notBefore = moment(0).add(nbf, "second");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token_id", authResult["jwt"]);
    localStorage.setItem("expires_at", expiresAt.toISOString());
    localStorage.setItem("not_before", notBefore.toISOString());
    return this.currentUser;
  }
}
