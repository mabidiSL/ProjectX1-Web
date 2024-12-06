import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { ViewCustomerComponent } from './view-customer/view-customer.component';

const routes: Routes = [
  {
  path: '',
  canActivate: [RoleGuard],
  data: {
    claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Role, claimValue: [Permission.ViewAll]}]

  },
  component: CustomersComponent
},
{
  path: "view/:id",
  component: ViewCustomerComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Role, claimValue:[Permission.ViewAll,Permission.View]}]

   }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
