import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import * as moment from "moment";
import {User} from "../../models/user";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import { map, catchError, toArray, mergeMap, concatMap} from "rxjs/operators";
import { throwError } from 'rxjs';
import {from} from "rxjs/internal/observable/from";
import {of} from "rxjs/internal/observable/of";
import {Authority, Role} from "../../models/authority";
import {UserProfile} from "../../models/userProfile";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  login_url = "http://192.168.99.100:8080/login";  // http://localhost:4200/backend/login";
  register_url = "http://192.168.99.100:8080/register";
  email_check_url = "http://192.168.99.100:8080/exists";
  register_email_url = "http://192.168.99.100:8080/users/addNewUser";
  send_pwd_url = "http://192.168.99.100:8080/confirm/";
  retrieve_user_url = "http://192.168.99.100:8080/users/retrieve/";
  profile_information_url = "http://192.168.99.100:8080/profile/information/";
  change_profile_information_url =  "http://192.168.99.100:8080/profile"

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.getUsersDetails([]);
    // TODO set role as well
    if(this.checkLoginState()){
      let u = JSON.parse(localStorage.getItem("user"));
      let user = new User(u._id, u._email);
      for(let a of u._authorities){
        user.addAuthority(new Authority(a._role, a._lineName));
      }
      this.currentUserSubject = new BehaviorSubject<User>(user);
      this.isLoggedInSubject = new BehaviorSubject<boolean>(true);
    }
    else{
      this.currentUserSubject = new BehaviorSubject<User>(null);
      this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
      this.resetSession();
    }

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
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
    return this.http.post<any>(this.register_url, {"email" : email, "pass" : pass, "repass" : repass});
          //.pipe(catchError(this.handleError));
  }

  registerEmail(email:string,checkboxCompanion:boolean){
    return this.http.post<any>(this.register_email_url, {"email" : email,"checkboxCompanion":checkboxCompanion});
  }

  sendPassword(pass:string, repass:string,token:string){
    console.log("invio pwd to " +this.send_pwd_url+token);
    return this.http.post<any>(this.send_pwd_url+token, { "pass" : pass, "repass" : repass}).pipe(catchError(err=>this.handleError(err)));
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}` +
        `message was: ${error.error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.status);
  };

  logout() {
    this.resetSession();
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  private resetSession(){
    localStorage.removeItem("user");
    localStorage.removeItem("token_id");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("not_before");
  }

  // TODO: VERIFY correct functioning
  checkLoginState(){
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

    const authorityObject = JSON.parse(userInfo["authorities"]);
    for(let k of Object.keys(authorityObject)){
      for(let line of authorityObject[k]){
        let authority = new Authority(Role.fromString(k), line);
        user.addAuthority(authority);
      }
    }

    // add seconds to moment 0 (1 Jan 1970 00:00:00)
    const expiresAt = moment(0).add(exp, "second");
    const notBefore = moment(0).add(nbf, "second");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token_id", authResult["jwt"]);
    localStorage.setItem("expires_at", expiresAt.toISOString());
    localStorage.setItem("not_before", notBefore.toISOString());

    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);

    return this.currentUser$;
  }

  checkExists(email: string){
    return this.http.post<boolean>(this.email_check_url, {"email": email});
  }

  getUsersDetails(ids: string[]): Observable<User[]>{
    /**
     * given an array of ids, retrieve user info and merge them to obtain a Observable<Array<User>>
     */
    if(ids === null || ids === undefined) ids = [];
    return from(ids).pipe(
      mergeMap((id) => this.http.get(this.retrieve_user_url+id)),
      mergeMap((user) =>{
        let u = new User(user['id'], user['email']);
        u.children = user['children'];
        return of(u);
      }),
      toArray()
    );
  }

  hasAuthorityOnLine(line: string) {
    return this.getCurrentUser().hasAuthorityOnLine(line);
  }


  getProfileinformation(current:User) {
    let em = current['_email'];
    return this.http.get<any>(this.profile_information_url + em).pipe(catchError(err=>this.handleError(err)));
  }

  getCurrentUserJwt(){
    return localStorage.getItem("token_id");
  }

  /*
  addChild(email:string,name:string,surname:string,birthday:string, gender:string){
    return this.http.post<any>(this.add_child_url,{
      "email":email,
      "name" : name,
      "surname" : surname,
      "birthday" : birthday,
      "gender" : gender
    })
  }*/

  editProfileInformation(email:string,name:string,surname:string,address:string, telephone:string){
    return this.http.post<any>(this.change_profile_information_url,{
      "email":email,
      "name" : name,
      "surname" : surname,
      "address" : address,
      "telephone" : telephone
    })
  }
}
