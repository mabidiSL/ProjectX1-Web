import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { ApproveMerchantComponent } from './approve-merchant/approve-merchant.component';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { EditMerchantComponent } from './edit-merchant/edit-merchant.component';
import { CreateMerchantComponent } from './create-merchant/create-merchant.component';
import { ViewMerchantComponent } from './view-merchant/view-merchant.component';

const routes: Routes = [
  {
    path: "create",
    component: CreateMerchantComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Merchants, claimValue:[Permission.ViewAll,Permission.Create]}]
  
    }
  },
  {
    path: "edit/:id",
    component: EditMerchantComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Merchants, claimValue:[Permission.ViewAll,Permission.Update]}]
  
     }
  },
  {
    path: "view/:id",
    component: ViewMerchantComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Merchants, claimValue:[Permission.ViewAll,Permission.View]}]
  
     }
  },
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      //claim: { claimType: [Modules.All,Modules.Merchants], claimValue: [Permission.All,Permission.ViewAll]}
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Merchants, claimValue: [Permission.ViewAll]}]

    },
    component: MerchantListComponent
  },
  {
    path: 'approve',
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Merchants, claimValue: [Permission.Approve, Permission.Decline]}]

    },
    component: ApproveMerchantComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantsRoutingModule { }
