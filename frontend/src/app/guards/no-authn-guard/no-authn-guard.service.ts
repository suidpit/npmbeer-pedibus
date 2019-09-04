import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {AuthService} from "../../services/auth/auth.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
/**
 * This Guard avoids having the user land on login page after being logged in.
 * If logged don't activate the route.
 */
export class NoAuthnGuard implements CanActivate{

  constructor(private router: Router, private auth: AuthService){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.auth.getCurrentUser();
    // TODO change presenze to Home.
    let return_url = "/presenze";
    if(!currentUser){
      return true;
    }
    this.router.navigate([return_url]);
    return false;
  }
}
