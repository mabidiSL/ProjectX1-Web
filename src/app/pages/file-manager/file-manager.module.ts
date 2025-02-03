import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerRoutingModule } from './file-manager-routing.module';
import { FileManagerComponent } from './file-manager.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { FileManagerService } from 'src/app/core/services/file-manager.service';

@NgModule({
  declarations: [FileManagerComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    UIModule,
    ReactiveFormsModule ,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    FileManagerRoutingModule
  ],
  providers:[FileManagerService]
})
export class FileManagerModule { }
