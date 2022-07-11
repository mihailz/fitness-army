import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {from, map, Observable, tap} from "rxjs";
import {User} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private angularFireAuth: AngularFireAuth) {
  }

  login(email: string, password: string): Observable<User | null> {
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        tap(response => console.log('login response: ', response)),
        map(response => new User(response?.user?.email))
      );
  }

  signup(email: string, password: string) {
    return from(this.angularFireAuth.createUserWithEmailAndPassword(email, password))
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
