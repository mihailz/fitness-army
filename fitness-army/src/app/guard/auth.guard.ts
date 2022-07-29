import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate, CanActivateChild,
  CanLoad,
  Route, Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {AuthApiService} from "../service/api/auth-api.service";
import {User} from "../model/user.model";

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(private router: Router, private authApiService: AuthApiService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> {
    return this.canLoadOrActivate();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canLoadOrActivate();
  }

  canLoad(route: Route, segments: UrlSegment[]):
    Observable<boolean | UrlTree> {
    return this.canLoadOrActivate();
  }

  private canLoadOrActivate(): Observable<boolean | UrlTree> {
    if (localStorage.getItem('user')) {
      return of(true);
    } else {
      return this.authApiService.user$
        .pipe(
          map((user: User | null) => {
            if (user) {
              return true;
            } else {
              return this.router.createUrlTree(['/home']);
            }
          })
        )
    }
  }

}
