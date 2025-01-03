import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftCardComponent } from './gift-card.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { EditGiftCardComponent } from './edit-gift-card/edit-gift-card.component';
import { CreateGiftCardComponent } from './create-gift-card/create-gift-card.component';
//import { ApproveGiftCardComponent } from './approve-gift-card/approve-gift-card.component';
import { ViewGiftCardComponent } from './view-gift-card/view-gift-card.component';

const routes: Routes = [
  
  {
    path: 'list',
    component: GiftCardComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Gift_Cards, claimValue:[Permission.All,Permission.ViewAll]}]
  }
  },
  {
    path: "create",
    component: CreateGiftCardComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Gift_Cards, claimValue:[Permission.All,Permission.ViewAll,Permission.Create]}]
  
    }
  },
  {
    path: "edit/:id",
    component: EditGiftCardComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Gift_Cards, claimValue:[Permission.All,Permission.ViewAll,Permission.Update]}]
  
     }
  },
  {
    path: "view/:id",
    component: ViewGiftCardComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Gift_Cards, claimValue:[Permission.All,Permission.ViewAll,Permission.View]}]
  
     }
  },
  // {
  //   path: "approve",
  //   component: ApproveGiftCardComponent,
  //   canActivate: [RoleGuard],
  //   data: {
  //     claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Gift_Cards, claimValue:[Permission.ViewAll,Permission.Approve,Permission.Decline]}]
  
  //   }
  // },
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftCardRoutingModule { }
