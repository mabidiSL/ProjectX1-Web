import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { CompaniesComponent } from './companies.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { ViewCompanyComponent } from './view-company/view-company.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Crm, claimValue: [Permission.All,Permission.ViewAll]}]
  
    },
    component: CompaniesComponent
  },
  {
    path: "create",
    component: CreateCompanyComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Crm, claimValue:[Permission.All,Permission.ViewAll,Permission.Create]}]
  
    }
  },
  {
    path: "edit/:id",
    component: EditCompanyComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Crm, claimValue:[Permission.All,Permission.ViewAll,Permission.Update]}]
  
     }
  },
  {
    path: "view/:id",
    component: ViewCompanyComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Crm, claimValue:[Permission.All,Permission.ViewAll,Permission.View]}]
  
     }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
