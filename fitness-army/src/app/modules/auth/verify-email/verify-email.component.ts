import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'fitness-army-app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  passwordResetEmailForm!: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initResetPasswordFormGroup();
  }

  getFControl(path: string): FormControl {
    return this.passwordResetEmailForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.passwordResetEmailForm.get(path)?.hasError('email')) {
      return 'Email is invalid!';
    }
    return 'You must enter a value';
  }

  resetPassword(): void {
    if (this.passwordResetEmailForm.invalid) {
      return;
    }
    const email = this.passwordResetEmailForm.get('email')?.value;
    localStorage.setItem('resetEmail', JSON.stringify(email));
    this.authApiService.forgotPassword(email, (state: boolean, error) => {
      this.setLoading(state);
      if (error) {
        this.toastrService.error('Unexpected error occurred', 'Error');
        return;
      }
      this.toastrService.success('Password reset email sent, check your inbox.', 'Verification email sent');
    });
  }

  private initResetPasswordFormGroup(): void {
    this.passwordResetEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  private setLoading(state = true): void {
    this.isLoading = state;
  }
}
