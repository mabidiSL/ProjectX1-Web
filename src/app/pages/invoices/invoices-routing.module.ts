import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices.component';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Customer_Invoice, claimValue: [Permission.ViewAll]}]

    },
    component: InvoicesComponent
  },
  {
      path: "view",
      component: DetailComponent,
      canActivate: [RoleGuard],
      data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Customer_Invoice, claimValue:[Permission.View]}]
    
       }
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
