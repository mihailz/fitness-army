import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {TokenService} from "../service/data/token.service";
import {Token} from "../model/token.model";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router, private tokenService: TokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userToken: Token = this.tokenService.userToken;
    if (userToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken.idToken}`
        }
      });
    }
    return next.handle(req);
  }

}
