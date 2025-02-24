import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmContactRoutingModule } from './crm-contact-routing.module';
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
import { SharedModule } from 'src/app/shared/shared.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { CrmContactComponent } from './crm-contact.component';
import { EditCrmContactComponent } from './edit-crm-contact/edit-crm-contact.component';
import { FormCrmContactComponent } from './form-crm-contact/form-crm-contact.component';
import { ViewCrmContactComponent } from './view-crm-contact/view-crm-contact.component';
import { CreateCrmContactComponent } from './create-crm-contact/create-crm-contact.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';


@NgModule({
  declarations: [CrmContactComponent, FormCrmContactComponent,ViewCrmContactComponent, EditCrmContactComponent, CreateCrmContactComponent ],
  imports: [
            CommonModule,
            BsDatepickerModule,
            WidgetModule,
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
    CrmContactRoutingModule
  ]
})
export class CrmContactModule { }
