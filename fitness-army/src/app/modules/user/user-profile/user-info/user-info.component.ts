import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../model/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserBodyStatsApiService} from "../../../../service/api/user-body-stats-api.service";
import {ToastrService} from "ngx-toastr";
import {UserBodyStats} from "../../../../model/user-body-stats.model";

@Component({
  selector: 'fitness-army-app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  @Input() user!: User | null;
  userBodyStatsForm!: FormGroup;
  bodyStats!: UserBodyStats | null;
  displayBodyStats!: boolean;

  constructor(private userBodyStatsApiService: UserBodyStatsApiService,
              private taostrService: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchUserBodyStats();
  }

  onUserProfileSave(): void {
    if (!this.userBodyStatsForm.valid) {
      Object.values(this.userBodyStatsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const dateOfBirth = this.userBodyStatsForm.get('dateOfBirth')?.value;
    const weight = this.userBodyStatsForm.get('weight')?.value;
    const height = this.userBodyStatsForm.get('height')?.value;
    const gender = this.userBodyStatsForm.get('gender')?.value;

    this.userBodyStatsApiService.createUserBodyStats(
      {birthDate: dateOfBirth,
        weight: weight,
        height: height,
        gender: gender}, this.user?.uid!
    ).subscribe({
      next: (response: any) => {
        console.log('onUserProfileSave: ', response);
        this.taostrService.success('Measurements has been created successfully!', 'Measurements created!');
      },
      error: err => console.log(err)
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

  private fetchUserBodyStats(): void {
    this.userBodyStatsApiService.getUserBodyStats(this.user?.uid!)
      .subscribe({
        next: (bodyStats: UserBodyStats | null) => {
          this.bodyStats = bodyStats;
          this.displayBodyStats = !!bodyStats;
          console.log('fetchUserBodyStats: ', bodyStats);
        },
        error: err => console.log(err)
      })
  }
}
