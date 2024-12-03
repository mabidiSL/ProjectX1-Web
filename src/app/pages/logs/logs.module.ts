import { NgModule } from '@angular/core';
import { LogsRoutingModule } from './logs-routing.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { FormLogsComponent } from './form-logs/form-logs.component';
import { ViewLogsComponent } from './view-logs/view-logs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './logs.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [LogsComponent, FormLogsComponent, ViewLogsComponent],
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule, 
    ReactiveFormsModule ,
    UIModule,
    TranslateModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    LogsRoutingModule
  ]
})
export class LogsModule { }
