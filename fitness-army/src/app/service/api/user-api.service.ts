import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {User} from "../../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseApiHref: string = '';

  constructor(private http: HttpClient) {
    this.baseApiHref = environment.applicationApi;
  }

  getUserData(userId: string): Observable<any> {
    return this.http.get(`${this.baseApiHref}/api/users/${userId}`)
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

}
