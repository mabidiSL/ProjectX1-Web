import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { OrdersComponent } from './orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Role, claimValue: [Permission.ViewAll]}]

    },
    component: OrdersComponent
  },
  {
    path: "view/:id",
    component: ViewOrderComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Role, claimValue:[Permission.ViewAll,Permission.View]}]
  
     }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
