import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {of, Subscription, switchMap} from "rxjs";
import {BodyStatsInfo} from "../../../../model/body-stats-info";
import {UserBodyStatsApiService} from "../../../../service/api/user-body-stats-api.service";
import {AuthApiService} from "../../../../service/api/auth-api.service";
import {User} from "../../../../model/user.model";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'fitness-army-app-update-user-body-stats',
  templateUrl: './update-user-body-stats.component.html',
  styleUrls: ['./update-user-body-stats.component.scss']
})
export class UpdateUserBodyStatsComponent implements OnInit, OnDestroy {

  userBodyStatsForm!: FormGroup;
  isFetchingData: boolean = false;
  private subscriptions = new Subscription();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userBodyStatsApiService: UserBodyStatsApiService,
              private authService: AuthApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getQueryParams();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  getFControl(path: string): FormControl {
    return this.userBodyStatsForm.get(path) as FormControl;
  }

  getFControlErrorMessage(): string {
    return 'Field is required!';
  }

  onSubmit(): void {
    if (this.userBodyStatsForm.invalid) {
      return;
    }

    this.updateUserStats();
  }

  updateUserStats(): void {
    this.setLoading();

    const dateOfBirth = this.userBodyStatsForm.get('dateOfBirth')?.value;
    const weight = this.userBodyStatsForm.get('weight')?.value;
    const height = this.userBodyStatsForm.get('height')?.value;
    const gender = this.userBodyStatsForm.get('gender')?.value;

    const sub$ = this.authService.user$
      .pipe(
        switchMap((user: User | null) => {
          if (user) {
            return this.userBodyStatsApiService.createOrUpdateUserBodyStats({
              birthDate: dateOfBirth,
              weight: weight,
              height: height,
              gender: gender
            }, user.uid, true)
          } else {
            return of(null);
          }
        })
      ).subscribe({
        next: (response) => {
          this.setLoading(false);
          this.router.navigate(['/user/profile']);
        },
        error: (err: HttpErrorResponse) => {
          this.setLoading(false);
          this.toastrService.error('An error has occurred!', err.message);
        }
      })

    this.subscriptions.add(sub$);
  }

  private getQueryParams(): void {
    const sub$ = this.route.queryParams
      .subscribe({
        next: (params: Params) => {
          const {weight, height, gender, birthDate, age} = params;
          const bodyStats = new BodyStatsInfo(age, birthDate, weight, height, gender);
          this.populateForm(bodyStats);
        }
      });

    this.subscriptions.add(sub$);
  }

  private populateForm(bodyStats: BodyStatsInfo): void {
    this.userBodyStatsForm.patchValue({
      dateOfBirth: bodyStats.birthDate,
      weight: bodyStats.weight,
      height: bodyStats.height,
      gender: bodyStats.gender
    })
  }

  private initForm(): void {
    this.userBodyStatsForm = new FormGroup({
      dateOfBirth: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required])
    })
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }
}
