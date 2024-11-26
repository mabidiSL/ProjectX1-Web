import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantsRoutingModule } from './merchants-routing.module';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';


import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CreateMerchantComponent } from './create-merchant/create-merchant.component';
import { EditMerchantComponent } from './edit-merchant/edit-merchant.component';
import { FormMerchantComponent } from './form-merchant/form-merchant.component';
import { ViewMerchantComponent } from './view-merchant/view-merchant.component';



@NgModule({
  declarations: [
    MerchantListComponent,
    CreateMerchantComponent,
    EditMerchantComponent,
    FormMerchantComponent,
    ViewMerchantComponent
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
    MerchantsRoutingModule,
    SharedModule
  ]
})
export class MerchantsModule { }
