import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {AuthService} from "../../services/auth/auth.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate{

  constructor(private router: Router, private auth: AuthService){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
                                      Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.auth.getCurrentUser();

    if(currentUser){
      if( route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
        this.router.navigate(["/login"]);
        return false;
      }
      return true;
    }
    else{
      // returnUrl allows to have the page be redirected to the url which was requested but required authN
      this.router.navigate(["/login"], {queryParams: { returnUrl: state.url}});
      return false;
    }
  }
}
