import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {map, Subscription, switchMap} from "rxjs";
import {UserApiService} from "../../../../service/api/user-api.service";
import {User} from "../../../../model/user.model";
import {validatePassword} from "../../../../util/validate-password";

@Component({
  selector: 'fitness-army-app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  userForm!: FormGroup;
  roles = ['admin', 'coach', 'user'];
  selectedRole!: string;
  private subscriptions: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute, private userApiService: UserApiService) { }

  ngOnInit(): void {
    this.initUserForm();
    this.fetchUserByUid();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  private fetchUserByUid() {
    const subscription = this.activatedRoute.params
      .pipe(
        map((params: Params) => params['uid']),
        switchMap((uid: string) => {
          return this.userApiService.getUserData(uid)
        })
      )
      .subscribe({
        next: (user: User) => {
          this.populateUserForm(user);
        }
      });
    this.subscriptions.add(subscription);
  }

  private initUserForm(): void {
    this.userForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.passwordValidation]),
      role: new FormControl('')
    });
  }

  private populateUserForm(user: User): void {
    this.selectedRole = user.role;
    this.userForm.patchValue({
      displayName: user.displayName,
      email: user.email,
      role: user.role
    });
  }

  private passwordValidation(): ValidationErrors | null {
    return validatePassword;
  }

  updateUser() {

  }
}
