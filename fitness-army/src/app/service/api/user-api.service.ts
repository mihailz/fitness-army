import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {from, map, Observable, switchMap} from "rxjs";
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
        ))
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
          return from(this.db.collection('users').doc(uid).update( { profileImage: downloadUrl }));
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
  //
  // getUsersByRole(): Observable<User[]> {}

  updateUser(user: User, queryParam: {[param: string]: string | number | boolean}, password?: string): Observable<any> {
    const params: Params = new HttpParams({
      fromObject: queryParam
    });
    return this.http.put(`${this.baseApiHref}/api/users/update-user/${user.uid}`, {
      displayName: user.displayName,
      email: user.email,
      password: password,
      role: user.role,
      profileImage: user.profileImage
    }, {
      params
    });
  }

}
