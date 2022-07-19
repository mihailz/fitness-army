import { Component, OnInit } from '@angular/core';
import {UserApiService} from "../../../service/api/user-api.service";
import {User} from "../../../model/user.model";
import {finalize} from "rxjs";
import {TableColumn} from "../../../model/table-column";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'fitness-army-app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit {

  users: User[] = [];
  tableColumns: TableColumn<User>[] = [];
  editId!: string | null;
  isFetchingData: boolean = false;
  roles = ['ADMIN', 'COACH', 'USER'];

  constructor(private router: Router,
              private userApiService: UserApiService,
              private toastrService: ToastrService) { }

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


  editUser(uid: string): void {
    this.editId = uid;
  }

  stopEditing(): void {
    this.editId = null;
  }

  onRoleChange(updatedRole: string, user: User): void {
    const updatedUser = {...user, role: updatedRole};
    const queryParam = {'update_password': true};
    this.userApiService.updateUser(updatedUser, queryParam)
      .subscribe({
        next: (response) => {
          console.log('response: ', response);
          this.toastrService.success('User role has been updated!', 'Role updated!');
        },
        error: err => console.log(err)
      });
  }
}
