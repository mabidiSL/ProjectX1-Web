import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
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
import { ViewCityComponent } from './view-city/view-city.component';
import { CreateCityComponent } from './create-city/create-city.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { FormCityComponent } from './form-city/form-city.component';

@NgModule({
  declarations: [
    CityComponent,
    CreateCityComponent,
    EditCityComponent,
    FormCityComponent,
    ViewCityComponent
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
    CityRoutingModule
  ]
})
export class CityModule { }
