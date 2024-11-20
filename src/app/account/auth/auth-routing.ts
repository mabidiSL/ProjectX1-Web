import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { Register2Component } from './register2/register2.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';

const routes: Routes = [
   
    {
        path: 'login',
        component: LoginComponent
    },
   
    {
        path: 'register',
        component: Register2Component
    },
    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
    {
        path: 'recoverpwd-2',
        component: Recoverpwd2Component
    },
   
    {
        path: 'update-password',
        component: UpdatepasswordComponent
    },
    {
        path: 'update-password/:id',
        component: UpdatepasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
