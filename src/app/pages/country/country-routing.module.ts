import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { CountryComponent } from './country.component';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { CreateCountryComponent } from './create-country/create-country.component';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { ViewCountryComponent } from './view-country/view-country.component';

const routes: Routes = [
  {
  path: '',
  canActivate: [RoleGuard],
  data: {
    claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}]

  },
  component: CountryComponent
},
{
  path: "create",
  component: CreateCountryComponent,
  canActivate: [RoleGuard],
  data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.Create]}]

  }
},
{
  path: "edit/:id",
  component: EditCountryComponent,
  canActivate: [RoleGuard],
  data: {
  claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.Update]}]

   }
},

  {
    path: "view/:id",
    component: ViewCountryComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.System_Administration, claimValue:[Permission.ViewAll,Permission.View]}]
  
     }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }
