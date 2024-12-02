import { NgModule } from '@angular/core';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { FormRoleComponent } from './form-role/form-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ViewRoleComponent } from './view-role/view-role.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    RolesComponent,
    CreateRoleComponent,
    EditRoleComponent,
    FormRoleComponent,
    ViewRoleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UIModule,
    CKEditorModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    RolesRoutingModule
  ]
})
export class RolesModule { }
