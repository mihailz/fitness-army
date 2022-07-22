import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../model/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'fitness-army-app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  @Input() user!: User | null;
  userStatsForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  onUserProfileSave(): void {
    if (!this.userStatsForm.valid) {
      Object.values(this.userStatsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    console.log(this.userStatsForm.value);
  }

  private initForm(): void {
    this.userStatsForm = new FormGroup({
      dateOfBirth: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required])
    })
  }
}
