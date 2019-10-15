import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import * as moment from "moment";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    AUTH_HEADER = "Authorization";

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type') && !(req.url.includes('/profile/') &&
            !(req.url.includes('/users/')) &&
            (req.method.includes('POST') || req.method.includes('PUT')))) {
            req = req.clone({
                headers: req.headers.set('Content-Type', 'application/json')
            });
        }
        req = this.addAuthenticationToken(req);

        return next.handle(req);
    }


    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        let token = localStorage.getItem("token_id");
        let expires_at = moment(localStorage.getItem("expires_at"));
        let not_before = moment(localStorage.getItem("not_before"));
        let now = moment();
        if (!token || now.isAfter(expires_at) || now.isBefore(not_before)) {
            return request;
        }
        // If you are calling an outside domain then do not add the token.
        if (!request.url.match(/192.168.99.100:8080\//)) {
            return request;
        }
        return request.clone({
            headers: request.headers.set(this.AUTH_HEADER, "bearer " + token)
        });
    }
}
