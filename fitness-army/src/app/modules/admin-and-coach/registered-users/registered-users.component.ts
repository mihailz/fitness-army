import { Component, OnInit } from '@angular/core';
import {UserApiService} from "../../../service/api/user-api.service";
import {User} from "../../../model/user.model";

@Component({
  selector: 'fitness-army-app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userApiService: UserApiService) { }

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  private fetchAllUsers(): void {
    this.userApiService.getAllUsers()
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
        }
      })
  }

}
