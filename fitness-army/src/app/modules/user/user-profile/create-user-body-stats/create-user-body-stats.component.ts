import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../model/user.model";

@Component({
  selector: 'fitness-army-app-create-user-body-stats',
  templateUrl: './create-user-body-stats.component.html',
  styleUrls: ['./create-user-body-stats.component.scss']
})
export class CreateUserBodyStatsComponent implements OnInit {

  @Input() user!: User | null;
  @Output() onCreateButtonClicked: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  userBodyStatsForm!: FormGroup;
  isFetchingData: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }


  getFControl(path: string): FormControl {
    return this.userBodyStatsForm.get(path) as FormControl;
  }

  getFControlErrorMessage(): string {
    return 'Field is required!';
  }

  // onUserProfileUpdate(): void {
  //   const dateOfBirth = this.userBodyStatsForm.get('dateOfBirth')?.value;
  //   const weight = this.userBodyStatsForm.get('weight')?.value;
  //   const height = this.userBodyStatsForm.get('height')?.value;
  //   const gender = this.userBodyStatsForm.get('gender')?.value;
  //
  //   // this.userBodyStatsApiService.createOrUpdateUserBodyStats(
  //   //   {
  //   //     birthDate: dateOfBirth,
  //   //     weight: weight,
  //   //     height: height,
  //   //     gender: gender
  //   //   }, this.user?.uid!, true
  //   // ).pipe(
  //   //   finalize(() => this.fetchingData = false),
  //   //   tap((response: any) => {
  //   //     this.fetchUserBodyStats()
  //   //   })
  //   // ).subscribe({
  //   //   next: () => {
  //   //     this.toastrService.success('Body stats has been updated successfully!', 'Body stats updated!');
  //   //   },
  //   //   error: err => {
  //   //     console.log(err);
  //   //     this.fetchingData = false;
  //   //   }
  //   // })
  // }

  private initForm(): void {
    this.userBodyStatsForm = new FormGroup({
      dateOfBirth: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required])
    })
  }

  onCreateUserStats(): void {

  }

  onSubmit() {
    console.log('onSubmit!');
    this.onCreateButtonClicked.emit(this.userBodyStatsForm);
  }
}
