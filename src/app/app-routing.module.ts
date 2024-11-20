import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { HomeComponent } from './extrapages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'private', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
