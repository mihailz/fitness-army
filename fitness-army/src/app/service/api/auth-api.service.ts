import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  finalize,
  from,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
  throwError
} from "rxjs";
import {User} from "../../model/user.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Token} from "../../model/token.model";
import {TokenService} from "../data/token.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import {GoogleAuthProvider} from 'firebase/auth';
import UserCredential = firebase.auth.UserCredential;
import {UserApiService} from "./user-api.service";
import {UserRoles} from "../../model/roles";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  baseApiHref: string = '';
  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private http: HttpClient,
              private tokenService: TokenService,
              private userApiService: UserApiService) {
    this.baseApiHref = environment.applicationApi;
    if (localStorage.getItem('user')) {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        this.userSubject.next(parsedUser);
      }
    }
  }

  login(email: string, password: string, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    from(this.angularFireAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        map((response: any) => {
          return response.user
        }),
        tap({
          next: (userData: any) => {
            const token = new Token(userData.getIdToken(true));
            this.tokenService.userToken = token;
          }
        }),
        map((userData: any) => userData.uid),
        switchMap((userId: string) => {
          return this.userApiService.getUserData(userId)
        }),
        catchError(err => throwError(() => err)),
      ).subscribe({
      next: (user: any) => {
        cb(true);
        this.userSubject.next(user);
        this.saveUserInLocalStorage();
      },
      error: (err: HttpErrorResponse) => {
        cb(false, err);
      }
    });
  }

  signup(displayName: string, email: string, password: string, role = 'USER',
         cb: (state: boolean, err?: HttpErrorResponse) => void): void {
    this.http.post(`${this.baseApiHref}/api/users/create`, {
      displayName,
      email,
      password,
      role
    }).pipe(
      catchError((err: HttpErrorResponse) => throwError(() => err))
    ).subscribe({
      next: () => {
        cb(true);
      },
      error: (err: HttpErrorResponse) => {
        cb(false, err);
      }
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
          this.userSubject.next(user);
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
          this.userSubject.next(null);
          this.removeUserFromLocalStorage();
          localStorage.removeItem('resetEmail');
        })
      )
  }

  forgotPassword(passwordResetEmail: string, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    cb(true);
    from(this.angularFireAuth
      .sendPasswordResetEmail(passwordResetEmail))
      .pipe(
        catchError(err => throwError(() => err))
      )
      .subscribe({
        next: () => {
          cb(false)
        },
        error: (err: HttpErrorResponse) => {
          cb(false, err);
        }
      })
  }


  saveUserInLocalStorage(): void {
    const user = this.userSubject.getValue();
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
