import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Injectable()
export class BmiApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      setHeaders: {
        "X-RapidAPI-Key": environment.bmiRapidApiKey,
        "X-RapidAPI-Host": environment.bmiRapidApiHost
      }
    });
    return next.handle(clonedRequest);
  }

}
