import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable, tap} from "rxjs";
import {User} from "../../model/user.model";
import {Params} from "@angular/router";

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
          response.user.email,
          response.user.uid,
          response.user.displayName,
          response.user.role
        ))
      );
  };

  createUser(user: User) {
    return this.http.post(`${this.baseApiHref}/api/users/create`, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    });
  }

  getAllUsers(): Observable<Array<User>> {
    return this.http.get(`${this.baseApiHref}/api/users`)
      .pipe(
        map((response: any) =>
          response.users.map((user: any) => new User(
            user.email,
            user.uid,
            user.displayName,
            user.role
          )))
      );
  }

  updateUser(user: User, queryParam: {[param: string]: string | number | boolean}, password?: string): Observable<any> {
    const params: Params = new HttpParams({
      fromObject: queryParam
    });
    return this.http.put(`${this.baseApiHref}/api/users/update-user/${user.uid}`, {
      displayName: user.displayName,
      email: user.email,
      password: password,
      role: user.role
    }, {
      params
    });
  }

}
