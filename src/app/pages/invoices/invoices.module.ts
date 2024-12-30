import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [InvoicesComponent, DetailComponent],
  imports: [
    CommonModule,
     FormsModule,
            ReactiveFormsModule,
            TranslateModule,
            UIModule,
            CKEditorModule,
            TooltipModule.forRoot(),
            PaginationModule.forRoot(),
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
