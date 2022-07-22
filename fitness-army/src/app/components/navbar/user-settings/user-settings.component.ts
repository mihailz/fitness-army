import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user.model";
import {AuthApiService} from "../../../service/api/auth-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'fitness-army-app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  @Input() user!: User | null;

  constructor(private router: Router,
              private authApiService: AuthApiService) { }

  ngOnInit(): void {

  }

  logout(): void {
    this.authApiService.signOut()
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        }
      });
  }

  navigateToUserProfile(): void {
      this.router.navigate(['/user/profile']);
  }
}
