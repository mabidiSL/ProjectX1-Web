import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsComponent } from './coupons.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { RoleGuard } from 'src/app/core/guards/role.guard';
//import { CouponApprovalComponent } from './coupon-approval/coupon-approval.component';
import { ViewCouponComponent } from './view-coupon/view-coupon.component';

const routes: Routes = [
  
{
  path: 'list',
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Coupons, claimValue:[Permission.ViewAll]}]
},
component: CouponsComponent

},
{
  path: "create",
  component: CreateCouponComponent,
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Coupons, claimValue:[Permission.ViewAll,Permission.Create]}]

  }
},
{
  path: "edit/:id",
  component: EditCouponComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Coupons, claimValue:[Permission.ViewAll,Permission.Update]}]

   }
},
{
  path: "view/:id",
  component: ViewCouponComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Coupons, claimValue:[Permission.ViewAll,Permission.View]}]

   }
},
// {
//   path: "approve",
//   component: CouponApprovalComponent,
//   canActivate: [RoleGuard],
//   data: {
//     claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Coupons, claimValue:[Permission.ViewAll,Permission.Approve,Permission.Decline]}]

//   }
// },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
