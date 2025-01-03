import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';
//import { Page404Component } from './extrapages/page404/page404.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ConfirmmailComponent } from './extrapages/confirmmail/confirmmail.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full'  },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'private', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages', component: LayoutComponent, loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },
  { path: 'verify-email', component: ConfirmmailComponent },

  { path: '**', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
