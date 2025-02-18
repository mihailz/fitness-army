import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, Subject, switchMap, tap, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {UserBodyStats} from "../../model/user-body-stats.model";
import {BodyMassIndexStats} from "../../model/body-mass-index-stats";
import {BodyFatPercentage} from "../../model/body-fat-percentage";
import {calculateUserAge} from "../../../../functions/src/functions/calculate-user-age";
import {BodyStatsInfo} from "../../model/body-stats-info";
import {IdealBodyWeight} from "../../model/ideal-body-weight";

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
                              uid: string, isUpdating: boolean): Observable<UserBodyStats> {
    const userAge = calculateUserAge(data.birthDate);
    const bodyMassStats$ = this.getBodyMassIndex(data.weight, data.height);
    const bodyFatPercentage$ = this.getBodyFatPercentage(data.weight, data.height, userAge, data.gender);
    const idealBodyWeight$ = this.getIdealBodyWeight(data.weight, data.height, data.gender);
    const bodyStats = new BodyStatsInfo(userAge, data.birthDate, data.weight, data.height, data.gender);
    return forkJoin([bodyMassStats$, bodyFatPercentage$, idealBodyWeight$])
      .pipe(
        map((response: [BodyMassIndexStats, BodyFatPercentage, IdealBodyWeight]) => {
          const bodyMassIndex: BodyMassIndexStats = response[0];
          const bodyFatPercentage: BodyFatPercentage = response[1];
          const idealBodyWeight: IdealBodyWeight = response[2];
          const userBodyStats: UserBodyStats = new UserBodyStats(
            bodyStats,
            bodyMassIndex,
            bodyFatPercentage,
            idealBodyWeight
          );
          return userBodyStats;
        }),
        switchMap((bodyStatsData: UserBodyStats) => {
          if (!isUpdating) {
            return this.http.post(`${this.baseApiHref}/api/body-stats/create/${uid}`, {
              bodyStatsInfo: bodyStatsData.bodyStats,
              bodyMassIndexInfo: bodyStatsData.bodyMassIndex,
              bodyFatPercentageInfo: bodyStatsData.bodyFatPercentage,
              idealBodyWeight: bodyStatsData.idealBodyWeight
            })
          } else {
            console.log('else- data: ', bodyStatsData);
            return this.http.put(`${this.baseApiHref}/api/body-stats/update/${uid}`, {
              bodyStatsInfo: bodyStatsData.bodyStats,
              bodyMassIndexInfo: bodyStatsData.bodyMassIndex,
              bodyFatPercentageInfo: bodyStatsData.bodyFatPercentage,
              idealBodyWeight: bodyStatsData.idealBodyWeight
            }).pipe(
              catchError(err => throwError(() => err))
            )
          }
        }),
        map((response: any) => {
          return new UserBodyStats(
          response.userBodyStats.bodyStats,
          response.userBodyStats.bodyMassIndex,
          response.userBodyStats.bodyFatPercentage,
          response.userBodyStats.idealBodyWeight
        )})
      );
  }

  getBodyMassIndex(weight: number, height: number): Observable<BodyMassIndexStats> {
    const url = `${this.bmiApiBaseHref}/bmi?weight=${weight}&height=${height}`;
    return this.http.get(url).pipe(
      map((response: any) => response.info),
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
      )),
      catchError(error => throwError(() => error))
    );
  }

  getIdealBodyWeight(weight: number, height: number, gender?: string): Observable<any> {
    const url = `${this.bmiApiBaseHref}/ibw?weight=${weight}&height=${height}&gender=${gender}`;
    return this.http.get(url)
      .pipe(
        map((response: any) => response.info),
        map((data: any) => new IdealBodyWeight(
          data.miller
        )),
        catchError(error => throwError(() => error))
      )
  }

  getUserBodyStats(uid: string,): Observable<any | null> {
    return this.http.get(`${this.baseApiHref}/api/body-stats/${uid}`)
      .pipe(
        map((response: any) => {
          if (Object.keys(response).length) {
            const userBodyStats =
              new UserBodyStats(
                response.userBodyStats.bodyStats,
                response.userBodyStats.bodyMassIndex,
                response.userBodyStats.bodyFatPercentage,
                response.userBodyStats.idealBodyWeight
              );
            console.log('userBodyStats: ', userBodyStats);
            return userBodyStats;
          } else {
            return null;
          }
        }),
        catchError(error => throwError(() => error))
      );
  }
}
