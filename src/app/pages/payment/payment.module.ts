import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { FormPaymentComponent } from './form-payment/form-payment.component';
import { PaymentComponent } from './payment.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [PaymentComponent,ViewPaymentComponent, CreatePaymentComponent, FormPaymentComponent,EditPaymentComponent ],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    BsDatepickerModule,
    TranslateModule,
    UIModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
