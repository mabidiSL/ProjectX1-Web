import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { Register2Component } from './register2/register2.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageService } from 'src/app/core/services/imageEx.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { RandomBackgroundService } from 'src/app/core/services/setBackgroundEx.service';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CountryService } from 'src/app/core/services/country-code.service';



@NgModule({
  declarations: [LoginComponent,  PasswordresetComponent, Register2Component, UpdatepasswordComponent],
  imports: [
    WidgetModule,
    NgSelectModule,
    MatInputModule,
    MatButtonModule,
    CdkStepperModule,
    NgStepperModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule.forRoot(),
    UIModule,
    TranslateModule ,
    AuthRoutingModule,
    SlickCarouselModule
  ],
  providers: [RandomBackgroundService,ImageService, LanguageService, CountryService]
})
export class AuthModule { 
constructor(
  private themeService: ThemeService,
  public translate: TranslateService,  
) {}

initializeLanguage(): Promise<void> {
  return new Promise<void>((resolve) => {
    const browserLang = this.translate.getBrowserLang();
    if (browserLang === 'ar') {
      this.themeService.loadRtlStyles(); // RTL for Arabic
    } else {
      this.themeService.loadLtrStyles(); // LTR for English
    }
    resolve();
  });
}
}