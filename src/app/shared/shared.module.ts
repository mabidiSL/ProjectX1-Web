import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { DirectiveModule } from './directive/directive.module';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    UIModule,
    WidgetModule
  ]
  
})

export class SharedModule { }
