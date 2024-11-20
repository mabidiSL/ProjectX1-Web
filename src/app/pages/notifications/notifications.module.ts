import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { CreateNotificationComponent } from './create-notification/create-notification.component';
import { EditNotificationComponent } from './edit-notification/edit-notification.component';
import { FormNotificationComponent } from './form-notification/form-notification.component';
import { NotificationsComponent } from './notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CreateNotificationComponent,
    EditNotificationComponent,
    FormNotificationComponent,
    NotificationsComponent,
    ViewNotificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UIModule,
    NgSelectModule,
    CKEditorModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    NotificationsRoutingModule
  ]
})
export class NotificationsModule { }
