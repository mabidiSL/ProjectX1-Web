import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { CustomerReviewsComponent } from './customer-reviews.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Customers, claimValue: [Permission.All,Permission.ViewAll]}]
  
    },
    component: CustomerReviewsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReviewsRoutingModule { }
