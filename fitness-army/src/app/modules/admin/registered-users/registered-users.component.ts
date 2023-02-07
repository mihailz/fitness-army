import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UserApiService} from "../../../service/api/user-api.service";
import {User} from "../../../model/user.model";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatSelectChange} from "@angular/material/select";

enum TableHeaderColumn {
  'displayName' = 'Username',
  'email' = 'Email',
  'role' = 'Role',
}

type IUserColumn = {
  [K in keyof User]: string
};

type ITableColumns = keyof Partial<User>;

@Component({
  selector: 'fitness-army-app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  users: User[] = [];
  isFetchingData: boolean = false;
  roles = ['ADMIN', 'COACH', 'USER'];
  displayedColumns: ITableColumns[] = ['displayName', 'email', 'role'];
  tableHeaderColumn = TableHeaderColumn as IUserColumn;
  dataSource: MatTableDataSource<IUserColumn> = new MatTableDataSource();

  constructor(private router: Router,
              private userApiService: UserApiService,
              private toastrService: ToastrService,
              private cdr: ChangeDetectorRef) {
  }

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

  onSelectionChange(matSelectChangeObject: MatSelectChange, userId: number): void {
    const role = matSelectChangeObject.value;
    this.onRoleChange(role, this.users[userId]);
  }

  onRoleChange(updatedRole: string, user: User): void {
    this.setLoading();
    const updatedUser = {...user, role: updatedRole};
    this.userApiService.updateUser(updatedUser, (status) => {
      this.setLoading(false);
      if (!status) {
       this.toastrService.error('An unexpected error has occurred', 'Error!');
       return;
      }
      this.toastrService.success('Role updated!', 'Success!');
    })
  }

  private setLoading(state = true): void {
    this.isFetchingData = state;
  }
}
