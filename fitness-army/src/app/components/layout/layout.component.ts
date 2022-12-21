import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter, map, Subscription} from "rxjs";
import {AuthApiService} from "../../service/api/auth-api.service";

@Component({
  selector: 'fitness-army-app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  showNavigationMenu: boolean = true;

  constructor(private router: Router, private authApiService: AuthApiService) { }

  ngOnInit(): void {
    this.listenForCurrentRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  listenForCurrentRoute(): void {
    const subscription = this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(event => event.url)
      )
      .subscribe({
        next: (url: string) => {
          this.showNavigationMenu = !url.startsWith('/auth');
        },
        error: (err => console.log(err))
      });

    this.subscriptions.add(subscription);
  }
}
