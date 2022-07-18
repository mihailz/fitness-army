import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter, map, Subscription} from "rxjs";

@Component({
  selector: 'fitness-army-app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  showNavigationMenu: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.listenForCurrentRoute();
    // if (localStorage.getItem('user')) {
    //   this.router.navigate(['/home']);
    // }
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
          this.showNavigationMenu = !url.startsWith('/auth')
        },
        error: (err => console.log(err))
      });

    this.subscriptions.add(subscription);
  }
}
