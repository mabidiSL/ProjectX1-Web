import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgOtpInputModule } from 'ng-otp-input';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';

import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';

import { ComingsoonComponent } from './comingsoon/comingsoon.component';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Page403Component } from './page403/page403.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [ Page404Component, Page500Component,  ConfirmmailComponent,ComingsoonComponent,  Page403Component],
  imports: [
    CommonModule,
    TranslateModule,
    ExtrapagesRoutingModule,
    NgOtpInputModule,
    SlickCarouselModule
  ]
})
export class ExtrapagesModule { }
