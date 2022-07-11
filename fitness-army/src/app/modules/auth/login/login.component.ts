import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthApiService} from "../../../service/auth-api.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
@Component({
  selector: 'fitness-army-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showError: boolean = false;
  isRememberMeChecked!: boolean;

  constructor(private authApiService: AuthApiService,
               private router: Router) { }

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
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authApiService.login(email, password)
      .pipe(
        finalize(() => this.showError = false)
      )
      .subscribe({
        next: (user) => {
          if (this.isRememberMeChecked) {
            console.log('Remember me is checked!');
            this.authApiService.saveUserInLocalStorage(user);
          }
          console.log(user);
          this.router.navigate(['/blog']);
        },
        error: err => {
          this.showError = true;
          this.loginForm.reset();
        }
      })
  }

  onCheckboxChecked($event: Event) {
    this.isRememberMeChecked = (<HTMLInputElement>$event.target).checked;
  }
}
