import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {Router} from "@angular/router";
import {User} from "../../../model/user.model";
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'fitness-army-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showError: boolean = false;
  isRememberMeChecked!: boolean;

  constructor(private router: Router,
              private authApiService: AuthApiService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  login(): void {
    this.showError = false;
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authApiService.login(email, password)
      .subscribe({
        next: (user: User) => {
          if (this.isRememberMeChecked) {
            this.authApiService.saveUserInLocalStorage(user);
          }
          this.router.navigate(['/blog']);
        },
        error: err => {
          console.log('error: ', err);
          this.showError = true;
          this.loginForm.reset();
        }
      })
  }

  onCheckboxChecked($event: Event) {
    this.isRememberMeChecked = (<HTMLInputElement>$event.target).checked;
  }

  loginWIthGoogleProvider(): void {
    this.authApiService.googleAuth()
      .subscribe({
        next: ((response) => {
          console.log('response: ', response);
          this.toastrService.success('User logged in successfully!', 'Login success');
          this.router.navigate(['/home']);
        }),
        error: err => console.log(err)
      });
  }

  navigateToResetPasswordPage(): void {
    this.router.navigate(['/auth/verify-email']);
  }
}
