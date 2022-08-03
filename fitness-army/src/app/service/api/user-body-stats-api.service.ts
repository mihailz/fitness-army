import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {UserBodyStats} from "../../model/user-body-stats.model";
import {BodyMassIndexStats} from "../../model/body-mass-index-stats";
import {BodyFatPercentage} from "../../model/body-fat-percentage";
import {calculateUserAge} from "../../../../functions/src/functions/calculate-user-age";
import {BodyStatsInfo} from "../../model/body-stats-info";

@Injectable({
  providedIn: 'root'
})
export class UserBodyStatsApiService {

  baseApiHref: string = '';
  bmiApiBaseHref: string = '';

  constructor(private http: HttpClient) {
    this.baseApiHref = environment.applicationApi;
    this.bmiApiBaseHref = environment.bmiRapidApiDomain;
  }

  createOrUpdateUserBodyStats(data: { birthDate: string, weight: number, height: number, gender: string },
                              uid: string, isUpdating: boolean): Observable<any> {
    const userAge = calculateUserAge(data.birthDate);
    const bodyMassStats$ = this.getBodyMassIndex(data.weight, data.height);
    const bodyFatPercentage$ = this.getBodyFatPercentage(data.weight, data.height, userAge, data.gender);
    return forkJoin([bodyMassStats$, bodyFatPercentage$])
      .pipe(
        map((response: any[]) => {
          const bodyMassIndex: BodyMassIndexStats = response[0];
          const bodyFatPercentage: BodyFatPercentage = response[1];
          const userBodyStats: UserBodyStats = new UserBodyStats(
            new BodyStatsInfo(calculateUserAge(data.birthDate), data.birthDate, data.weight, data.height, data.gender),
            bodyMassIndex,
            bodyFatPercentage
          );
          return userBodyStats;
        }),
        switchMap((data: UserBodyStats) => {
          if (!isUpdating) {
            return this.http.post(`${this.baseApiHref}/api/body-stats/create/${uid}`, {
              bodyStatsInfo: data.bodyStats,
              bodyMassIndexInfo: data.bodyMassIndex,
              bodyFatPercentageInfo: data.bodyFatPercentage
            })
          } else {
            return this.http.put(`${this.baseApiHref}/api/body-stats/update/${uid}`, {
              bodyStatsInfo: data.bodyStats,
              bodyMassIndexInfo: data.bodyMassIndex,
              bodyFatPercentageInfo: data.bodyFatPercentage
            })
          }
        })
      )
  }

  getBodyMassIndex(weight: number, height: number): Observable<BodyMassIndexStats> {
    const url = `${this.bmiApiBaseHref}/bmi?weight=${weight}&height=${height}`;
    return this.http.get(url).pipe(
      map((response: any) => response.info),
      tap(response => console.log('getBodyMassIndex: ', response)),
      map((data: any) => new BodyMassIndexStats(
        data.bmi,
        data.health,
        data.healthy_bmi_range
      ))
    )
  }

  getBodyFatPercentage(weight: number, height: number, age?: number, gender?: string): Observable<BodyFatPercentage> {
    const url = `${this.bmiApiBaseHref}/bfp?weight=${weight}&height=${height}&age=${age}&gender=${gender}`;
    return this.http.get(url).pipe(
      map((response: any) => response.info),
      map((data: any) => new BodyFatPercentage(
        data.bfp,
        data.fat_mass,
        data.lean_mass
      ))
    );
  }

  getUserBodyStats(uid: string,): Observable<any> {
    return this.http.get(`${this.baseApiHref}/api/body-stats/${uid}`)
      .pipe(
        map((response: any) => response.userBodyStats),
        map((data: any) => {
          if (Object.keys(data).length === 0) {
            return null;
          } else {
            return new UserBodyStats(
              data.bodyStats,
              data.bodyMassIndex,
              data.bodyFatPercentage
            )
          }
        })
      );
  }
}
