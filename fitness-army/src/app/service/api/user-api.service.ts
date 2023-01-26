import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, map, Observable, throwError} from "rxjs";
import {User} from "../../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseApiHref: string = '';

  constructor(private http: HttpClient) {
    this.baseApiHref = environment.applicationApi;
  }

  getUserData(userId: string): Observable<User> {
    return this.http.get(`${this.baseApiHref}/api/users/${userId}`)
      .pipe(
        map((response: any) => new User(
          response.user.uid,
          response.user.email,
          response.user.displayName,
          response.user.photoURL,
          response.user.role
        )),
        catchError(err => throwError(() => err))
      );
  };

  getUserRole(userId: string): Observable<any> {
    return this.http.get(`${this.baseApiHref}/api/users/${userId}/role`);
  }

  getUsers(role: string = 'ALL'): Observable<Array<User>> {
    return this.http.get(`${this.baseApiHref}/api/users`, {
      params: new HttpParams().set('user_role', role
      )
    })
      .pipe(
        map((response: any) =>
          response.users.map((user: any) => new User(
            user.uid,
            user.email,
            user.displayName,
            user.profileImage
          )))
      );
  }

}
