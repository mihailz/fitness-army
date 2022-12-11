import { Component, OnInit } from '@angular/core';
import {UserApiService} from "../../../service/api/user-api.service";
import {User} from "../../../model/user.model";
import {UserRoles} from "../../../model/roles";

@Component({
  selector: 'fitness-army-app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  coaches: User[]  = [];

  constructor(private usersApiService: UserApiService) { }

  ngOnInit(): void {
    this.getCoachUsers();
  }

  getCoachUsers(): void {
    this.usersApiService.getUsers(UserRoles.COACH)
      .subscribe({
        next: ((users: User[]) => {
          console.log('users: ', users)
        }),
        error: (error) => {
          console.log(error)
        }
      })
  }

}
