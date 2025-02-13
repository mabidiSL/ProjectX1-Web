import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { FormCompanyComponent } from './form-company/form-company.component';
import { ViewCompanyComponent } from './view-company/view-company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';


@NgModule({
  declarations: [CompaniesComponent, ViewCompanyComponent, FormCompanyComponent, CreateCompanyComponent],
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
    CompaniesRoutingModule
  ]
})
export class CompaniesModule { }
