import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { AdminCompanyProfileComponent } from './admin-company-profile/admin-company-profile.component';

const routes: Routes = [
 
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'company',
        component: AdminCompanyProfileComponent
    },
    {
        path: 'merchant-company',
        component: CompanyProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
