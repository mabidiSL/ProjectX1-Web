import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserlistComponent } from './userlist/userlist.component';
import { UsergridComponent } from './usergrid/usergrid.component';
import { ProfileComponent } from './profile/profile.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';

const routes: Routes = [
    {
        path: 'list',
        component: UserlistComponent
    },
    {
        path: 'grid',
        component: UsergridComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'company',
        component: CompanyProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
