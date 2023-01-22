import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, from, map, Observable, Subject, switchMap, throwError} from "rxjs";
import {User} from "../../model/user.model";
import {Params} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseApiHref: string = '';

  constructor(private http: HttpClient,
              private storage: AngularFireStorage,
              private db: AngularFirestore) {
    this.baseApiHref = environment.applicationApi;
  }

  getUserData(userId: string): Observable<User> {
    return this.http.get(`${this.baseApiHref}/api/users/${userId}`)
      .pipe(
        map((response: any) => new User(
          response.user.email,
          response.user.uid,
          response.user.displayName,
          response.user.role,
          response.user.profileImage
        )),
        catchError(err => throwError(() => err))
      );
  };


  createUser(user: User): Observable<any> {
    return this.http.post(`${this.baseApiHref}/api/users/create`, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      profileImage: user.profileImage
    });
  }

  uploadUserImage(file: File, uid: string): Observable<any> {
    const path = `${uid}`;
    const ref = this.storage.ref(path);
    let imageUrl = "";
    return from(this.storage.upload(path, file))
      .pipe(
        switchMap(() => {
          return ref.getDownloadURL();
        }),
        switchMap((downloadUrl: any) => {
          imageUrl = downloadUrl;
          return from(this.db.collection('users').doc(uid).update({profileImage: downloadUrl}));
        }),
        map(() => imageUrl)
      )
  }

  getUsers(role: string = 'ALL'): Observable<Array<User>> {
    return this.http.get(`${this.baseApiHref}/api/users`, {
      params: new HttpParams().set('user_role', role
      )
    })
      .pipe(
        map((response: any) =>
          response.users.map((user: any) => new User(
            user.email,
            user.uid,
            user.displayName,
            user.role,
            user.profileImage
          )))
      );
  }

  updateUser(user: User, queryParam: { [param: string]: string | number | boolean },
             password: string, cb: (status: boolean, error?: HttpErrorResponse) => void): void {
    cb(true);
    const params: Params = new HttpParams({
      fromObject: queryParam
    });
    this.http.put(`${this.baseApiHref}/api/users/update-user/${user.uid}`, {
      ...user, password: password}, { params} )
      .pipe(
        catchError(err => throwError(() => err))
      )
      .subscribe({
        next: () => {
          cb(false);
        },
        error: (err: HttpErrorResponse) => {
          cb(false, err)
        }
      });
  }

}
