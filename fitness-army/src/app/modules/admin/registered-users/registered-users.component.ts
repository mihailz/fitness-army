import { Component, OnInit } from '@angular/core';
import {UserApiService} from "../../../service/api/user-api.service";
import {User} from "../../../model/user.model";
import {finalize} from "rxjs";
import {TableColumn} from "../../../model/table-column";

@Component({
  selector: 'fitness-army-app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit {

  users: User[] = [];
  tableColumns: TableColumn<User>[] = [];
  isFetchingData: boolean = false;

  constructor(private userApiService: UserApiService) { }

  ngOnInit(): void {
    this.initTableColumns();
    this.fetchAllUsers();
  }

  private fetchAllUsers(): void {
    this.isFetchingData = true;
    this.userApiService.getAllUsers()
      .pipe(
        finalize(() => this.isFetchingData = false)
      )
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
        }
      })
  }

  private initTableColumns(): void {
    this.tableColumns = [
      {
        title: 'UID',
        compare: (userA: User, userB: User) => userA.uid.localeCompare(userB.uid)
      },
      {
        title: 'Username',
        compare: (userA: User, userB: User) => userA.displayName.localeCompare(userB.displayName)
      },
      {
        title: 'Email',
        compare: (userA: User, userB: User) => userA.email.localeCompare(userB.email)
      },
      {
        title: 'Role',
        compare: (userA: User, userB: User) => userA.role.localeCompare(userB.role)
      }
    ];
  }

}
