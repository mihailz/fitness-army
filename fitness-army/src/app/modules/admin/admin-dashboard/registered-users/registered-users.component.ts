import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UserApiService} from "../../../../service/api/user-api.service";
import {User} from "../../../../model/user.model";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'fitness-army-app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  users: User[] = [];
  editId!: string | null;
  isFetchingData: boolean = false;
  roles = ['ADMIN', 'COACH', 'USER'];
  displayedColumns: string[] = ['displayName', 'email', 'role'];

  dataSource: MatTableDataSource<User> =  new MatTableDataSource();

  constructor(private router: Router,
              private userApiService: UserApiService,
              private toastrService: ToastrService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  private fetchAllUsers(): void {
    this.isFetchingData = true;
    this.userApiService.getUsers()
      .pipe(
        finalize(() => this.isFetchingData = false)
      )
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdr.markForCheck();
        }
      })
  }

  editUser(uid: string): void {
    this.editId = uid;
  }

  stopEditing(): void {
    this.editId = null;
  }

  onRoleChange(updatedRole: string, user: User): void {
    console.log('onRoleChange: ', updatedRole);

    const updatedUser = {...user, role: updatedRole};
    const queryParam = {'update_password': false};
    this.userApiService.updateUser(updatedUser, queryParam)
      .subscribe({
        next: (response) => {
          this.toastrService.success('User role has been updated!', 'Role updated!');
        },
        error: err => console.log("Error: ", err)
      });
  }
}
