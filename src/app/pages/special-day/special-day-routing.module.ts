import { NgModule } from '@angular/core';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { RouterModule, Routes } from '@angular/router';
import { CreateSpecialDayComponent } from './create-special-day/create-special-day.component';
import { EditSpecialDayComponent } from './edit-special-day/edit-special-day.component';
import { SpecialDayComponent } from './special-day.component';
import { ViewSpecialDayComponent } from './view-special-day/view-special-day.component';

const routes: Routes = [

  
    {
      path: 'list',
      canActivate: [RoleGuard],
      data: {
        claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.SpecialDay, claimValue:[Permission.All,Permission.ViewAll]}]
    },
    component: SpecialDayComponent
    
    },
    {
      path: "create",
      component: CreateSpecialDayComponent,
      canActivate: [RoleGuard],
      data: {
        claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.SpecialDay, claimValue:[Permission.All,Permission.ViewAll,Permission.Create]}]
    
      }
    },
    {
      path: "edit/:id",
      component: EditSpecialDayComponent,
      canActivate: [RoleGuard],
      data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.SpecialDay, claimValue:[Permission.All,Permission.ViewAll,Permission.Update]}]
    
       }
    },
    {
      path: "view/:id",
      component: ViewSpecialDayComponent,
      canActivate: [RoleGuard],
      data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.SpecialDay, claimValue:[Permission.All,Permission.ViewAll,Permission.View]}]
    
       }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialDayRoutingModule { }
