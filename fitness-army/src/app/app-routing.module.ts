import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home-page/home-page.module')
      .then(m => m.HomePageModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./modules/blog/blog.module')
      .then(m => m.BlogModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module')
      .then(m => m.UserModule),
    // canLoad: [AuthGuard],
    // canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
