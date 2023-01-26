import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../../model/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserBodyStatsApiService} from "../../../../service/api/user-body-stats-api.service";
import {ToastrService} from "ngx-toastr";
import {UserBodyStats} from "../../../../model/user-body-stats.model";
import {finalize, Subscription, tap} from "rxjs";
import {ChartOptions} from "chart.js";
import {AuthApiService} from "../../../../service/api/auth-api.service";

@Component({
  selector: 'fitness-army-app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy, AfterContentInit {

  user!: User | null;
  userBodyStatsForm!: FormGroup;
  userBodyStats!: UserBodyStats | null;
  fetchingData: boolean = false;
  editMode: boolean = false;
  chartLabels: string[] = [];
  chartData: any;
  chartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: "Body mass (%)",
      display: true,
      fontStyle: 'bold',
      fontSize: 20
    }
  };
  private subscriptions: Subscription = new Subscription();

  constructor(private userBodyStatsApiService: UserBodyStatsApiService,
              private toastrService: ToastrService,
              private authApiService: AuthApiService) {
  }

  ngOnInit(): void {
    this.getUser();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  ngAfterContentInit(): void {
    this.fetchUserBodyStats();
  }

  onUserProfileCreate(): void {
    this.fetchingData = true;
    if (!this.userBodyStatsForm.valid) {
      Object.values(this.userBodyStatsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }
    const dateOfBirth = this.userBodyStatsForm.get('dateOfBirth')?.value;
    const weight = this.userBodyStatsForm.get('weight')?.value;
    const height = this.userBodyStatsForm.get('height')?.value;
    const gender = this.userBodyStatsForm.get('gender')?.value;

    this.userBodyStatsApiService.createOrUpdateUserBodyStats(
      {
        birthDate: dateOfBirth,
        weight: weight,
        height: height,
        gender: gender
      }, this.user?.uid!, false
    ).pipe(
      finalize(() => this.fetchingData = false),
      tap((response: any) => {
        this.fetchUserBodyStats()
      })
    ).subscribe({
      next: () => {
        this.toastrService.success('Body stats has been created successfully!', 'Body stats created!');
      },
      error: err => {
        console.log(err);
        this.fetchingData = false;
      }
    })
  }

  onUserProfileUpdate(): void {
    this.fetchingData = true;
    const dateOfBirth = this.userBodyStatsForm.get('dateOfBirth')?.value;
    const weight = this.userBodyStatsForm.get('weight')?.value;
    const height = this.userBodyStatsForm.get('height')?.value;
    const gender = this.userBodyStatsForm.get('gender')?.value;

    this.userBodyStatsApiService.createOrUpdateUserBodyStats(
      {
        birthDate: dateOfBirth,
        weight: weight,
        height: height,
        gender: gender
      }, this.user?.uid!, true
    ).pipe(
      finalize(() => this.fetchingData = false),
      tap((response: any) => {
        this.fetchUserBodyStats()
      })
    ).subscribe({
      next: () => {
        this.toastrService.success('Body stats has been updated successfully!', 'Body stats updated!');
      },
      error: err => {
        console.log(err);
        this.fetchingData = false;
      }
    })
  }

  enterEditMode(): void {
    this.editMode = true;
    this.userBodyStatsForm.patchValue({
      dateOfBirth: this.userBodyStats?.bodyStats.birthDate,
      weight: this.userBodyStats?.bodyStats.weight,
      height: this.userBodyStats?.bodyStats.height,
      gender: this.userBodyStats?.bodyStats.gender
    });
  }

  setUserGenderPhoto(): string {
    return this.userBodyStats?.bodyStats?.gender === 'male' ?
      './assets/images/male.png' : './assets/images/female.png';
  }

  private initForm(): void {
    this.userBodyStatsForm = new FormGroup({
      dateOfBirth: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required])
    })
  }

  private fetchUserBodyStats(): void {
    this.fetchingData = true;
    this.userBodyStatsApiService.getUserBodyStats(this.user?.uid!)
      .pipe(
        finalize(() => this.fetchingData = false)
      )
      .subscribe({
        next: (bodyStats: UserBodyStats | null) => {
          this.userBodyStats = bodyStats;
          this.initChartData();
        },
        error: err => {
          console.log(err);
          this.fetchingData = false;
        }
      })
  }

  private initChartData(): void {
    this.chartLabels = ['Lean mass', 'Fat mass'];
    this.chartData = [this.userBodyStats?.bodyFatPercentage?.leanMassWeight,
      this.userBodyStats?.bodyFatPercentage?.fatMassWeight];
  }

  private getUser(): void {
    const sub$ = this.authApiService.user$
      .subscribe({
        next: (user: any) => {
          this.user = user;
        }
      });

    this.subscriptions.add(sub$);
  }
}
