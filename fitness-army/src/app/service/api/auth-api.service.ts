import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {from, map, Observable, switchMap, tap} from "rxjs";
import {User} from "../../model/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Token} from "../../model/token.model";
import {TokenService} from "../data/token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  baseApiHref: string = '';

  constructor(private angularFireAuth: AngularFireAuth, private http: HttpClient, private tokenService: TokenService) {
    this.baseApiHref = environment.applicationApi;
  }

  login(email: string, password: string): Observable<User> {
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        switchMap((response: any) => {
          return from(response.user.getIdToken(true))
            .pipe(
              switchMap((idToken: any) => {
                return this.getUserData(response.user.uid)
                  .pipe(
                    tap(() => {
                      const token: Token = new Token(idToken);
                      this.tokenService.userToken = token;
                    }),
                    map((response: any) => new User(
                          response.user.email,
                          response.user.uid,
                          response.user.password,
                          response.user.displayName,
                          response.user.role)
                     )
                  )
              })
            )
        }),
      );
  }

  getUserData(userId: string): Observable<any> {
    return this.http.get(`${this.baseApiHref}/api/users/${userId}`)
  }

  signup(displayName: string, email: string, password: string, role: string = 'user') {
    return this.http.post(`${this.baseApiHref}/api/users/create`, {
      displayName,
      email,
      password,
      role
    });
  }

  saveUserInLocalStorage(user: User | null): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeUserFromLocalStorage(): void {
    localStorage.removeItem('user');
  }

  getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }
}
