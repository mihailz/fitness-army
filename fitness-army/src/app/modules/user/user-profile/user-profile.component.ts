import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserBodyStatsApiService} from "../../../service/api/user-body-stats-api.service";
import {ToastrService} from "ngx-toastr";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {map, mergeMap, of, Subscription, tap} from "rxjs";
import {User} from "../../../model/user.model";
import {UserBodyStats} from "../../../model/user-body-stats.model";
import {FormGroup} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'fitness-army-app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user!: User | null;
  userBodyStats!: UserBodyStats | null;
  isFetchingData: boolean = false;
  chartData: any;
  chartLabels: string[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private userBodyStatsApiService: UserBodyStatsApiService,
              private toastrService: ToastrService,
              private authApiService: AuthApiService,) { }

  ngOnInit(): void {
    this.getUserAndFetchBodyStats();
  }

  ngOnDestroy(): void {
  }

  private getUserAndFetchBodyStats(): void {
    this.setLoading();
    const sub$ = this.authApiService.user$
      .pipe(
        mergeMap((user: User | null) => {
          if (user) {
            return this.userBodyStatsApiService.getUserBodyStats(user.uid)
              .pipe(
                map((bodyStats: UserBodyStats | null) => {
                  if (bodyStats) {
                    return {user, bodyStats};
                  } else {
                   return {user, bodyStats: null};
                  }
                })
              )
          } else {
            return of(null);
          }
        })
      ).subscribe({
        next: ((result: {user: User, bodyStats: UserBodyStats | null} | null) => {
          this.setLoading(false);
          if (result) {
            this.user = result.user;
          }
          if (result && result.bodyStats) {
            this.userBodyStats = result.bodyStats;
          }
        }),
        error: (err: HttpErrorResponse) => {
          this.setLoading(false);
          console.log(err);
        }
      })

    this.subscriptions.add(sub$);
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

  createUserBodyStats(bodyStatsForm: FormGroup): void {
    if (bodyStatsForm.invalid) {
      return;
    }
    this.setLoading();
    const dateOfBirth = bodyStatsForm.get('dateOfBirth')?.value;
    const weight = bodyStatsForm.get('weight')?.value;
    const height = bodyStatsForm.get('height')?.value;
    const gender = bodyStatsForm.get('gender')?.value;

    if (this.user) {
      this.userBodyStatsApiService.createOrUpdateUserBodyStats({
        birthDate: dateOfBirth,
        weight: weight,
        height: height,
        gender: gender
      }, this.user.uid, false)
        .subscribe({
          next: ((bodyStats: UserBodyStats) => {
            this.setLoading(false);
            this.userBodyStats = bodyStats;
          }),
          error: (error: HttpErrorResponse) => {
            this.setLoading(false);
            console.log(error);
          }
        })
    }
  }

}
