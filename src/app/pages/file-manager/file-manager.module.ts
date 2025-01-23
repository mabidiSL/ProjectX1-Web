import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerRoutingModule } from './file-manager-routing.module';
import { FileManagerComponent } from './file-manager.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UIModule } from 'src/app/shared/ui/ui.module';
@NgModule({
  declarations: [FileManagerComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    UIModule,
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    FileManagerRoutingModule
  ]
})
export class FileManagerModule { }
