import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { CreateStoreComponent } from './create-store/create-store.component';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { StoresComponent } from './stores.component';
import { ViewStoreComponent } from './view-store/view-store.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Stores, claimValue: [Permission.All,Permission.ViewAll]}]

    },
    component: StoresComponent
  },
  {
    path: "create",
    component: CreateStoreComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Stores, claimValue:[Permission.All,Permission.ViewAll,Permission.Create]}]
  
    }
  },
  {
    path: "edit/:id",
    component: EditStoreComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Stores, claimValue:[Permission.All,Permission.ViewAll,Permission.Update]}]
  
     }
  },
  {
    path: "view/:id",
    component: ViewStoreComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.Stores, claimValue:[Permission.All,Permission.ViewAll,Permission.View]}]
  
     }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule { }
