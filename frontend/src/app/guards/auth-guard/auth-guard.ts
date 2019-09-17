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
      // NO AuthZ
      if( route.data.roles ){
        let authz = route.data.roles.filter((role) => currentUser.hasMinAuthority(role)).length > 0;
        if(!authz) {
          this.router.navigate(["/auth_error"]);
          return false;
        }
      }

      // OK
      return true;
    }
    // NO AuthN
    else{
      // returnUrl allows to have the page be redirected to the url which was requested but required authN
      this.router.navigate(["/login"], {queryParams: { returnUrl: state.url}});
      return false;
    }
  }
}
