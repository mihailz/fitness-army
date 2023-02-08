import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, concatMap, map, Observable, switchMap, throwError} from "rxjs";
import {User} from "../../model/user.model";
import {ImageUploadService} from "./image-upload.service";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseApiHref: string = '';

  constructor(private http: HttpClient,
              private imageUploadService: ImageUploadService) {
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

  updateUser(updatedUser: User, cb: (status: boolean) => void) {
    return this.http.post(`${this.baseApiHref}/api/users/${updatedUser.uid}/update`, {
      user: updatedUser
    }).subscribe({
      next: (res) => {
        console.log('updateUser: ', res);
        cb(true);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        cb(false);
      }
    })
  }

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
            user.photoURL,
            user.role
          )))
      );
  }

  deleteUser(uid: string): Observable<User[]> {
    return this.http.delete(`${this.baseApiHref}/api/users/delete/${uid}`)
      .pipe(
        concatMap(() =>
          this.imageUploadService.deleteImage(uid, `images/profile/${uid}`)
            .pipe(
              switchMap(() => this.getUsers()),
              catchError(error => throwError(() => error))
            )
        ),
        catchError(error => throwError(() => error))
      );
  }

}
