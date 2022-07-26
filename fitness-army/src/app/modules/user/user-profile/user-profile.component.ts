import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../model/user.model";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {NzTabChangeEvent} from "ng-zorro-antd/tabs";

@Component({
  selector: 'fitness-army-app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user!: User | null;
  private subscription: Subscription = new Subscription();
  selectedIndex = 0;

  constructor(private router: Router,
              private authApiService: AuthApiService) { }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getUser(): void {
    const subscription = this.authApiService.user$
      .subscribe({
        next: (user: User | null) => {
          this.user = user;
        },
        error: err => {
          console.log(err);
        }
      })
    this.subscription.add(subscription);
  }

  onTabIndexChange($event: NzTabChangeEvent): void {

  }
}
