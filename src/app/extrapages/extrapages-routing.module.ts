import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';

import { ConfirmmailComponent } from './confirmmail/confirmmail.component';

import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { HomeComponent } from './home/home.component';
import { Page403Component } from './page403/page403.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    
    {
        path: 'coming-soon',
        component: ComingsoonComponent
    },
    {
        path: '403',
        component: Page403Component
    },
    {
        path: '404',
        component: Page404Component
    },
    {
        path: '500',
        component: Page500Component
    },
    {
        path: 'confirm-mail',
        component: ConfirmmailComponent
    }
   
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ExtrapagesRoutingModule { }
