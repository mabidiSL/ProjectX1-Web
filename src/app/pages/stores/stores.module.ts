import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { CreateStoreComponent } from './create-store/create-store.component';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { FormStoreComponent } from './form-store/form-store.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';


import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { UiSwitchModule } from 'ngx-ui-switch';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ViewStoreComponent } from './view-store/view-store.component';


@NgModule({
  declarations: [
    StoresComponent,
    CreateStoreComponent,
    EditStoreComponent,
    FormStoreComponent,
    ViewStoreComponent
  ],
  imports: [
    CommonModule,
    WidgetModule,
    UiSwitchModule,
    UIModule,
    NgSelectModule,
    NgApexchartsModule,
    FormsModule, 
    ReactiveFormsModule ,
    TranslateModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    DropzoneModule,
    StoresRoutingModule
  ]
})
export class StoresModule { }
