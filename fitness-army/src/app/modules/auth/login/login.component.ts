import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {from, Subscription, tap} from "rxjs";
import {longHexNumber} from "docx";

@Component({
  selector: 'fitness-army-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  isRememberMeChecked!: boolean;
  isFetchingData = false;
  showError = false;
  hide = true;
  private subs$ = new Subscription();

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.initLoginForm();
    const sub$ = from(this.loginForm.valueChanges)
      .pipe(
        tap({
          next: () => {
            if (this.showError) {
              this.showError = false;
            }
          }
        })
      ).subscribe();
    this.subs$.add(sub$);
  }

  ngOnDestroy(): void {
    this.subs$?.unsubscribe();
  }

  private initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  getFControl(path: string): FormControl {
    return this.loginForm.get(path) as FormControl;
  }

  getFControlErrorMessage(path: string): string {
    if (this.loginForm.get(path)?.hasError('email')) {
      return 'Email is invalid!';
    }
    return 'You must enter a value';
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.setLoading();
    const {email, password} = this.loginForm.value;
    this.authApiService.login(email, password, (status: boolean, error) => {
      this.setLoading(false);
      if (!status) {
        this.showError = true;
        return;
      }
      if (this.isRememberMeChecked) {
        this.authApiService.saveUserInLocalStorage()
        this.router.navigate(['/blogs']);
      }
    });
  }

  onCheckboxChecked(changeObject: MatCheckboxChange) {
    this.isRememberMeChecked = changeObject.checked;
  }

  loginWIthGoogleProvider(): void {
    this.authApiService.googleAuth()
      .subscribe({
        next: ((response) => {
          console.log('response: ', response);
          this.toastrService.success('User logged in successfully!', 'Login success');
          this.router.navigate(['/blogs']);
        }),
        error: err => console.log(err)
      });
  }

  navigateToResetPasswordPage(): void {
    this.router.navigate(['/auth/verify-email']);
  }

  navigateToSignUpPage() {
    this.router.navigate(['/auth/signup']);
  }

  resetForm(formDirective: FormGroupDirective): void {
    formDirective.resetForm();
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }
}
