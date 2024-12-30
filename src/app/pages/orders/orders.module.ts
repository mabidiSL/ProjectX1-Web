import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { OrdersComponent } from './orders.component';


@NgModule({
  declarations: [OrdersComponent],
  imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        UIModule,
        CKEditorModule,
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        OrdersRoutingModule
  ]
})
export class OrdersModule { }
