import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AuthApiService} from "./service/api/auth-api.service";
import {Observable} from "rxjs";
import {User} from "./model/user.model";
import {APPLICATION_ROUTES} from "./mappings/routes-mapping";
import {Router} from "@angular/router";

@Component({
  selector: 'fitness-army-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  user$!: Observable<User | null>;
  routes = APPLICATION_ROUTES;

  constructor(private router: Router,
              private observer: BreakpointObserver,
              private authApiService: AuthApiService) {
  }

  ngOnInit(): void {
    this.getCurrentLoggedInUser();
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  logout(): void {
    this.authApiService.signOut()
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        }
      });
  }

  private getCurrentLoggedInUser(): void {
    this.user$ = this.authApiService.user$;
  }
}
