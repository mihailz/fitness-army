import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthApiService} from "../../service/api/auth-api.service";
import {Subscription} from "rxjs";
import {User} from "../../model/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'fitness-army-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user!: User | null;
  private subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private authApiService: AuthApiService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
}
