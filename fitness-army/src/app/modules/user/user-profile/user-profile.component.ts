import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../model/user.model";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthApiService} from "../../../service/api/auth-api.service";
import firebase from "firebase/compat";

@Component({
  selector: 'fitness-army-app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user$!: Observable<any>;
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
    this.user$ =  this.authApiService.user$

  }

}
