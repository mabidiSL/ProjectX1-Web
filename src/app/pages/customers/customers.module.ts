import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CustomersRoutingModule } from './customers-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormCustomerComponent } from './form-customer/form-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { CustomersComponent } from './customers.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [CustomersComponent, FormCustomerComponent, ViewCustomerComponent],
  imports: [
    CommonModule,
    WidgetModule,
    BsDatepickerModule,
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
    AccordionModule,
    UiSwitchModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
