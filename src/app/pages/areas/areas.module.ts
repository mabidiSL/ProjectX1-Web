import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreasRoutingModule } from './areas-routing.module';
import { AreasComponent } from './areas.component';
import { CreateAreaComponent } from './create-area/create-area.component';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { FormAreaComponent } from './form-area/form-area.component';
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
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewAreaComponent } from './view-area/view-area.component';

@NgModule({
  declarations: [
    AreasComponent,
    CreateAreaComponent,
    EditAreaComponent,
    FormAreaComponent,
    ViewAreaComponent
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
    SharedModule,
    AreasRoutingModule
  ]
})
export class AreasModule { }
