import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialDayRoutingModule } from './special-day-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { CreateSpecialDayComponent } from './create-special-day/create-special-day.component';
import { EditSpecialDayComponent } from './edit-special-day/edit-special-day.component';
import { FormSpecialDayComponent } from './form-special-day/form-special-day.component';
import { SpecialDayComponent } from './special-day.component';
import { ViewSpecialDayComponent } from './view-special-day/view-special-day.component';


@NgModule({
  declarations: [
    SpecialDayComponent,
    EditSpecialDayComponent,
    CreateSpecialDayComponent,
    FormSpecialDayComponent,
    ViewSpecialDayComponent],
  imports: [
    CommonModule,
    UiSwitchModule,
    WidgetModule,
    BsDatepickerModule,
    UIModule,
    NgSelectModule,
    
    NgMultiSelectDropDownModule,
    FormsModule, 
    ReactiveFormsModule ,
    TranslateModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    SharedModule,
    SpecialDayRoutingModule
  ]
})
export class SpecialDayModule { }
