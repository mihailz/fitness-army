import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../model/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserBodyStatsApiService} from "../../../../service/api/user-body-stats-api.service";
import {ToastrService} from "ngx-toastr";
import {UserBodyStats} from "../../../../model/user-body-stats.model";
import {finalize, switchMap, tap} from "rxjs";

@Component({
  selector: 'fitness-army-app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, AfterContentInit {

  @Input() user!: User | null;
  userBodyStatsForm!: FormGroup;
  userBodyStats!: UserBodyStats | null;
  bodyMassChartData: Array<{ value: number | undefined, name: string }> = [];
  fetchingData: boolean = false;
  editMode: boolean = false;
  options: any;

  constructor(private userBodyStatsApiService: UserBodyStatsApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
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
      './assets/images/male_user.jpg' : './assets/images/female_user.jpg';
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
          this.initBodyMassChart();
          console.log('fetchUserBodyStats: ', bodyStats);
        },
        error: err => {
          console.log(err);
          this.fetchingData = false;
        }
      })
  }

  private initBodyMassChart(): void {
    this.bodyMassChartData = [
      {
        value: this.userBodyStats?.bodyFatPercentage?.leanMassWeight,
        name: "Lean mass"
      },
      {
        value: this.userBodyStats?.bodyFatPercentage?.fatMassWeight,
        name: "Fat mass"
      },
    ];
    this.setOptions()
  }

  private setOptions() {
    this.options = {
      tooltip: {
        trigger: 'item'
      },
      title: {
        show: true,
        text: "Body mass (kg)",
        left: "35%",
        top: "30"
      },
      area: {
        prefix: "kg"
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          data: this.bodyMassChartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}
