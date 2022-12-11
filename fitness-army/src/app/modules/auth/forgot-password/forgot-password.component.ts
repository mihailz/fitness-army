import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {UserApiService} from "../../../service/api/user-api.service";
import {User} from "../../../model/user.model";
import {tap} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'fitness-army-app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  currentUser!: User | undefined;

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private userApiService: UserApiService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
  }

  resetPassword(): void {
    if (!this.resetPasswordForm.valid) {
      return;
    }
    if (!this.currentUser) {
      return;
    }
    const updatedPassword = this.resetPasswordForm.get('password')?.value;
    const user = {...this.currentUser};
    const queryParam = {'update_password': true};
    this.userApiService.updateUser(this.currentUser, queryParam, updatedPassword)
      .subscribe({
        next: (response) => {
          this.toastrService.success('The password has been updated!', 'Password updated');
          this.router.navigate(['/auth/login']);
        },
        error: err => console.log(err)
      })
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private getCurrentUser(): void {
    this.userApiService.getUsers()
      .pipe(
        tap((users: User[]) => {
          const email = localStorage.getItem('resetEmail');
          if (email) {
            const parsedEmail = JSON.parse(email);
            const user = users.find((user: User) => user.email === parsedEmail);
            this.currentUser = user;
          }
        })
      ).subscribe();
  }

  private initForm(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, this.validatePassword])
    });
  }

  private validatePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    let numberOfLowerLetters = 0;
    let numberOfCapitalLetters = 0;
    let numberOfDigits = 0;
    let numberOfSpecialCharacters = 0;

    if (!password || password.length < 8) {
      return {
        'passwordInvalid': 'Password is not valid!'
      };
    } else {
      password.split('').forEach((character: string) => {
        if (character >= 'a' && character <= 'z') {
          numberOfLowerLetters++;
        } else if (character >= 'A' && character <= 'Z') {
          numberOfCapitalLetters++;
        } else if (character >= '0' && character <= '9') {
          numberOfDigits++;
        } else {
          numberOfSpecialCharacters++;
        }
      });
      if (numberOfLowerLetters >= 1 && numberOfCapitalLetters >= 1
        && numberOfDigits >= 1 && numberOfSpecialCharacters >= 1) {
        return null;
      } else {
        return {
          'passwordInvalid': 'Password is not valid!'
        };
      }
    }
  }
}
