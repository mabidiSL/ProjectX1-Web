import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { ViewCrmContactComponent } from './view-crm-contact/view-crm-contact.component';
import { EditCrmContactComponent } from './edit-crm-contact/edit-crm-contact.component';
import { CrmContactComponent } from './crm-contact.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Crm, claimValue: [Permission.All,Permission.ViewAll]}]
  
    },
    component: CrmContactComponent
  },
  // {
  //   path: "create",
  //   component: CreateCompanyComponent,
  //   canActivate: [RoleGuard],
  //   data: {
  //     claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Crm, claimValue:[Permission.All,Permission.ViewAll,Permission.Create]}]
  
  //   }
  // },
  {
    path: "edit/:id",
    component: EditCrmContactComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Crm, claimValue:[Permission.All,Permission.ViewAll,Permission.Update]}]
  
     }
  },
  {
    path: "view/:id",
    component: ViewCrmContactComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Crm, claimValue:[Permission.All,Permission.ViewAll,Permission.View]}]
  
     }
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmContactRoutingModule { }
