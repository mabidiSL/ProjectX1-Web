import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';


import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsComponent } from './coupons.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { FormCouponComponent } from './form-coupon/form-coupon.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewCouponComponent } from './view-coupon/view-coupon.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    CouponsComponent,
    EditCouponComponent,
    CreateCouponComponent,
    FormCouponComponent,
    //CouponApprovalComponent,
    ViewCouponComponent
  ],
  imports: [
    CommonModule,
    UiSwitchModule,
    WidgetModule,
    BsDatepickerModule,
    UIModule,
    NgSelectModule,
    NgApexchartsModule,
    NgMultiSelectDropDownModule,
    FormsModule, 
    ReactiveFormsModule ,
    TranslateModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    CouponsRoutingModule,
    SharedModule
  ]
})
export class CouponsModule { }
