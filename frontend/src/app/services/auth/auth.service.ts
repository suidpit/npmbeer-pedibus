import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as moment from "moment";
import {not} from "rxjs/internal-compatibility";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login_url = "http://localhost:4200/backend/login";


  constructor(private http: HttpClient) { }

  login(email: string, password: string){
    let self = this;
    return this.http.post<any>(this.login_url, {"email": email, "password": password}).subscribe(
      res => {
        self.setSession(res);
      });
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("not_before");
  }

  isLoggedIn(){
    return moment().isBefore(this.getExpiration());
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

    // add seconds to moment 0 ( 1 Jan 1970 00:00:00)
    const expiresAt = moment(0).add(exp, "second");
    const notBefore = moment(0).add(userInfo["nbf"], "second");
    localStorage.setItem("token_id", authResult);
    localStorage.setItem("expires_at", expiresAt.toISOString());
    localStorage.setItem("not_before", notBefore.toISOString());
  }
}
