import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";

@Component({
  selector: 'fitness-army-app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;

  constructor(private router: Router,
              private authApiService: AuthApiService) { }

  ngOnInit(): void {
    this.initForm();
  }

  resetPassword(): void {
    this.authApiService.sendVerificationMail()
      .then(response => {
        console.log('sendVerificationEmail: ', response);
      })
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
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
