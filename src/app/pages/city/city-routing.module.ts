import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { CityComponent } from './city.component';
import { CreateCityComponent } from './create-city/create-city.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { ViewCityComponent } from './view-city/view-city.component';

const routes: Routes = [
  {
  path: '',
  canActivate: [RoleGuard],
  data: {
    claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}]

  },
  component: CityComponent
},
{
  path: "create",
  component: CreateCityComponent,
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.Create]}]

  }
},
{
  path: "edit/:id",
  component: EditCityComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.Update]}]

   }
  },
  ,
  {
    path: "view/:id",
    component: ViewCityComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.View]}]
  
     }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
