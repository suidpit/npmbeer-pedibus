import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../../models/user";
import {Authority} from "../../models/authority";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Child} from "../../models/child";
import {error} from "selenium-webdriver";
import {stringify} from "querystring";
import {AuthService} from "../auth/auth.service";
import {UserProfile} from "../../models/userProfile";
import {catchError, mergeMap, toArray} from "rxjs/operators";
import {ChangePassword} from "../../models/changepassword";
import {Builder} from "builder-pattern";
import {Form, NgForm} from "@angular/forms";
import {from} from "rxjs/internal/observable/from";

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    public children$: Subject<Child[]> = new BehaviorSubject(null);
    public user$: Subject<UserProfile> = new BehaviorSubject(null);
    baseUrl = "http://localhost:8080";

    constructor(private http: HttpClient, private auth: AuthService) {
        auth.isLoggedIn$.subscribe(((logged)=>{
            if(logged){
                this.getChildren();
                this.getProfileinformation();
            }else{
                this.children$.next(null);
                this.user$.next(null);
            }
        }))
    }

    public getChildren() {
        this.http.get<Child[]>(this.baseUrl + "/profile/children").subscribe((children) => {
            this.children$.next(children);
        });
    }

    /**
     * returns a list of all the users
     * @returns {Observable<any>} any is actually an object <userID>: <userEmail>
     */
    public getUsers():Observable<any>{
        return this.http.get<any>("http://localhost:8080/users");
    }

    public putUserAuthority(userId: string, action:string, lineName: string){
      let payload = {
        authority: "ADMIN",
        action: action,
        lineName: lineName
      };
      return this.http.put("http://localhost:8080/users/"+userId, payload);
    }

    public getAllChildren(): Observable<Child[]>{
      return this.http.get<Child[]>(this.baseUrl + "/profile/children/all");
    }

    public getChildrenById(ids: string[]):Observable<Child[]>{
      if(ids === undefined || ids === null) ids = [];
      return from(ids).pipe(
          mergeMap((id) => this.http.get<Child>(this.baseUrl + "/profile/children/"+id)),
          toArray()
      );
    }

    public getChildById(id: string):Observable<Child>{
      return this.http.get<Child>(this.baseUrl + "/profile/children/"+id);
    }

    public updateChild(child: Child, file: File) {
        if (file != null) {
            child.photoFile = true;
        }
        return this.http.put(this.baseUrl + "/profile/children/" + child.id, ProfileService.prepareChild(child, file));
    }

    public deleteChild(child: Child) {
        return this.http.delete(this.baseUrl + "/profile/children/" + child.id)
    }

    private static prepareChild(child: Child, file: File): FormData {
        let f = new FormData();
        f.append('child', new Blob([JSON.stringify(child)], {type: "application/json"}));
        f.append('photo', file);
        return f;
    }

    public addChild(child: Child, file: File) {
        if (file != null) {
            child.photoFile = true;
        }
        return this.http.post(this.baseUrl + "/profile/children", ProfileService.prepareChild(child, file));
    }

    getProfileinformation(){
        this.http.get<UserProfile>(this.baseUrl+"/profile/information").subscribe((user)=>{
            console.log(user);
            this.user$.next(user);
        });
    }

    saveUser(user: UserProfile, file: File) {
        if (file != null) {
            user.photoFile = true;
        }
        let f = new FormData();
        f.append('user', new Blob([JSON.stringify(user)], {type: "application/json"}));
        f.append('photo', file);
        return this.http.put(this.baseUrl+"/profile/information", f);
    }

    changePassword(cp: ChangePassword) {
        return this.http.put(this.baseUrl+"/profile/changePassword", cp);
    }
}
