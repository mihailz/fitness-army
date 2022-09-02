import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user.model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoachApiService {

  baseApiHref: string = '';

  constructor(private http: HttpClient) {
    this.baseApiHref = environment.applicationApi;
  }

  createCoach(user: User): Observable<any> {
    return this.http.post(`${this.baseApiHref}/api/coaches/create/${user.uid}`, {
      user: user
    })
  }
}
