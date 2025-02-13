import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AdminCompanyProfileComponent } from './admin-company-profile/admin-company-profile.component';

const routes: Routes = [
 
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'company',
        component: AdminCompanyProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
