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
    error$: Subject<any> = new BehaviorSubject(undefined);
    private authService: AuthService;

    constructor(private http: HttpClient, private auth: AuthService) {
        this.getChildren();
        this.getProfileinformation();
        this.authService = auth;
    }

    public getChildren() {
        this.http.get<Child[]>(this.baseUrl + "/profile/children").subscribe((children) => {
            this.children$.next(children);
        });
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
        this.http.put(this.baseUrl + "/profile/children/" + child.id, ProfileService.prepareChild(child, file),
        )
            .subscribe(() => {
                },
                (error) => {
                    console.log(error);
                    this.error$.next("Operation failed, retry later");
                },
                () => {
                    this.error$.next("Operation completed");
                    this.getChildren();
                }
            )
    }

    public deleteChild(child: Child) {
        this.http.delete(this.baseUrl + "/profile/children/" + child.id)
            .subscribe(() => {
                },
                () => {
                    this.error$.next("Operazione fallita, riprovare più tardi")
                },
                () => {
                    this.error$.next("Operation completed");
                    this.getChildren();
                }
            )
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
        this.http.post(this.baseUrl + "/profile/children", ProfileService.prepareChild(child, file),
        )
            .subscribe(() => {
                },
                (error) => {
                    console.log(error);
                    this.error$.next("Operazione fallita, riprovare più tardi");
                },
                () => {
                    this.error$.next("Operation completed");
                    this.getChildren();
                }
            )
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
        this.http.put(this.baseUrl+"/profile/changePassword", cp).subscribe(()=>{}, ()=>{}, ()=>{})
    }
}
