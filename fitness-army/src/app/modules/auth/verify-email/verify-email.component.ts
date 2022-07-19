import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'fitness-army-app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  passwordResetEmailForm!: FormGroup;

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initResetPasswordFormGroup();
  }

  private initResetPasswordFormGroup(): void {
    this.passwordResetEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  resetPassword(): void {
    const email = this.passwordResetEmailForm.get('email')?.value;
    localStorage.setItem('resetEmail', JSON.stringify(email));
    this.authApiService.forgotPassword(email)
      .subscribe({
        next: (response) => {
          this.toastrService.success('Password reset email sent, check your inbox.', 'Verification email sent');
        },
        error: err => console.log(err)
      })
  }
}
