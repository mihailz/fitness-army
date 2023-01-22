import {Component, OnInit} from '@angular/core';
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
  isLoading = false;
  hide = true;

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private userApiService: UserApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
  }

  getFControl(path: string): FormControl {
    return this.resetPasswordForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.resetPasswordForm.get(path)?.hasError('passwordInvalid')) {
      return 'Password is invalid, please enter valid password!';
    }
    return 'You must enter a value';
  }

  resetPassword(): void {
    if (!this.resetPasswordForm.valid || !this.currentUser) {
      return;
    }
    const updatedPassword = this.resetPasswordForm.get('password')?.value;
    const queryParam = {'update_password': true};
    this.userApiService.updateUser(this.currentUser, queryParam, updatedPassword, (status: boolean, error) => {
      this.setLoading(status);
      if (error) {
        this.toastrService.error('Unexpected error has occurred!', 'Error');
        return;
      }
      this.navigateToLogin();
      this.toastrService.success('The password has been updated!', 'Password updated');
    });
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
      password: new FormControl('', [Validators.required])
    });
  }

  private setLoading(status = true): void {
    this.isLoading = status;
  }
}

