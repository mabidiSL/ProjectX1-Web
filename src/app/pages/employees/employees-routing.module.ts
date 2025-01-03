import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';

const routes: Routes = [
  {
  path: 'list',
  component: EmployeesComponent,
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Employees, claimValue:[Permission.All,Permission.ViewAll]}]
}
},
{
  path: "create",
  component: CreateEmployeeComponent,
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Employees, claimValue:[Permission.All,Permission.ViewAll,Permission.Create]}]

  }
},
{
  path: "edit/:id",
  component: EditEmployeeComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Employees, claimValue:[Permission.ViewAll,Permission.Update]}]

   }
},
{
  path: "view/:id",
  component: ViewEmployeeComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Employees, claimValue:[Permission.All,Permission.ViewAll,Permission.View]}]

   }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
