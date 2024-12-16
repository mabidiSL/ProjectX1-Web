import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { RolesComponent } from './roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Role, claimValue: [Permission.ViewAll]}]

    },
    component: RolesComponent
  },
  {
    path: "create",
    component: CreateRoleComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Role, claimValue:[Permission.ViewAll,Permission.Create]}]
  
    }
  },
  {
    path: "edit/:id",
    component: EditRoleComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Role, claimValue:[Permission.ViewAll,Permission.Update]}]
  
     }
  },
  {
    path: "view/:id",
    component: ViewRoleComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Role, claimValue:[Permission.ViewAll,Permission.View]}]
  
     }
  },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
