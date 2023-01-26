import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  catchError, concatMap,
  from,
  map,
  Observable, of,
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
import {GoogleAuthProvider} from 'firebase/auth';
import {UserApiService} from "./user-api.service";
import {Router} from "@angular/router";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserInfo
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  baseApiHref: string = '';

  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  rememberMeSubject = new BehaviorSubject<boolean>(false);
  rememberMe$ = this.rememberMeSubject.asObservable();

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private http: HttpClient,
              private tokenService: TokenService,
              private userApiService: UserApiService,
              private auth: Auth) {
    this.baseApiHref = environment.applicationApi;
    if (localStorage.getItem('user')) {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        this.userSubject.next(parsedUser);
      }
    }
  }

  login(userName: string, password: string, cb: (status: boolean, error?: HttpErrorResponse) => void) {
    from(signInWithEmailAndPassword(this.auth, userName, password))
      .pipe(
        map((userCredentials) => userCredentials.user),
        switchMap((userData) => this.userApiService.getUserRole(userData.uid)
          .pipe(
            map((role) => new User(
              userData.uid,
              userData.email!,
              userData.displayName!,
              userData.photoURL!,
              role.role
            )),
            tap({
              next: (user: User) => {
                this.userSubject.next(user);
              }
            }),
            switchMap(() => this.rememberMe$),
            tap({
              next: (rememberMe: boolean) => {
                if (rememberMe) {
                  this.saveUserInLocalStorage();
                }
              }
            })
          )),
      )
      .subscribe({
        next: () => {
          cb(true);
        },
        error: (error: HttpErrorResponse) => {
          cb(false);
        }
      })
  }

  signup(userName: string, email: string, password: string, role = 'USER',
         cb: (state: boolean, err?: HttpErrorResponse) => void): void {
    from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        map(userData => userData.user),
        concatMap((user) =>
          from(updateProfile(user, {displayName: userName}))
            .pipe(
              switchMap(() =>
                this.createAndStoreUserToFireStoreDatabase(user.uid, user.email!, user.displayName!, role))
            )),
        catchError(err => throwError(() => err))
      ).subscribe({
      next: ((res) => {
        cb(true);
      }),
      error: (error: HttpErrorResponse) => {
        console.log(error);
        cb(false, error);
      }
    })

  };

  createAndStoreUserToFireStoreDatabase(uid: string, email: string, displayName: string, role: string): Observable<any> {
    return this.http.post(`${this.baseApiHref}/api/users/create`, {
      uid,
      email,
      displayName,
      role
    });
  }

  googleAuth(cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    this.authLogin(new GoogleAuthProvider())
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
            response.user.uid,
            response.user.email,
            response.user.displayName,
            response.user.photoURL,
          );
          return user;
        }),
      ).subscribe({
      next: (user: User) => {
        cb(true);
        this.userSubject.next(user);
        this.saveUserInLocalStorage();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        cb(false, err);
      }
    });
  }

  authLogin(provider: GoogleAuthProvider): Observable<any> {
    return from(this.angularFireAuth.signInWithPopup(provider));
  }

  signOut() {
    return from(this.auth.signOut())
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

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user)
      .pipe(
        concatMap((user: any) => {
          if (!user) throw new Error('Not Authenticated');
          return updateProfile(user, profileData);
        }),
      )
  }

  passwordReset(userId: string, password: string, cb: (status: boolean) => void): void {
    this.http.put(`${this.baseApiHref}/api/users/${userId}/password-reset`, {password})
      .pipe(
        catchError(err => throwError(() => err))
      ).subscribe({
      next: () => {
        cb(true);
      },
      error: (error: HttpErrorResponse) => {
        cb(false);
      }
    });
  }

  saveUserInLocalStorage(): void {
    const user = this.userSubject.getValue();
    console.log('saveUserInLocallStorage: ', user);
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
