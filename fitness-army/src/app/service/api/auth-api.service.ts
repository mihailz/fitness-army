import {Injectable} from '@angular/core';
import {BehaviorSubject, from, map, Observable, Subject, switchMap, tap} from "rxjs";
import {User} from "../../model/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Token} from "../../model/token.model";
import {TokenService} from "../data/token.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import {GoogleAuthProvider} from 'firebase/auth';
import UserCredential = firebase.auth.UserCredential;
import {UserApiService} from "./user-api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  baseApiHref: string = '';
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private angularFireAuth: AngularFireAuth,
              private http: HttpClient,
              private tokenService: TokenService,
              private userApiService: UserApiService) {
    this.baseApiHref = environment.applicationApi;
  }

  login(email: string, password: string): Observable<User> {
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        map((response: any) => response.user),
        switchMap((user: any) => {
          return from(user.getIdToken(true))
            .pipe(
              switchMap((idToken: any) => {
                return this.getUserData(user.uid)
                  .pipe(
                    tap(() => {
                      const token: Token = new Token(idToken);
                      this.tokenService.userToken = token;
                    }),
                    map((response: any) => {
                      const user: User = new User(
                        response.user.email,
                        response.user.uid,
                        response.user.displayName,
                        response.user.role);
                      this.user$.next(user);
                      return user;
                    })
                  )
              })
            )
        }),
      );
  }

  getUserData(userId: string): Observable<any> {
    return this.userApiService.getUserData(userId);
  };

  signup(displayName: string, email: string, password: string, role: string = 'user') {
    return this.http.post(`${this.baseApiHref}/api/users/create`, {
      displayName,
      email,
      password,
      role
    });
  };

  googleAuth(): Observable<any> {
    return this.authLogin(new GoogleAuthProvider())
      .pipe(
        tap((response: any) => {
          from(response.user.getIdToken(true))
            .pipe(
              map((idToken: any) => {
                const token: Token = new Token(idToken);
                this.tokenService.userToken = token;
              })
            )
        }),
        map((response: any) => {
          const user: User = new User(
            response.user.email,
            response.user.uid,
            response.user.displayName,
            'user'
          );
          this.user$.next(user);
          return user;
        }),
        switchMap((user: User) => {
          return this.userApiService.createUser(user);
        }),
      );
  }

  authLogin(provider: GoogleAuthProvider): Observable<UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(provider));
  }

  signOut() {
    return from(this.angularFireAuth.signOut())
      .pipe(
        tap(() => {
          this.user$.next(null);
          this.removeUserFromLocalStorage();
        })
      )
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
