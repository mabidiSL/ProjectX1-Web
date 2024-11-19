/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// bootstrap component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ToastrModule } from 'ngx-toastr';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from './cyptolanding/shared/shared.module';

// Store
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
// Page Route
import { ExtrapagesModule } from './extrapages/extrapages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Auth
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { rootReducer } from './store';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { CandidateEffects } from './store/Candidate/candidate.effects';

import { CustomerEffects } from './store/customer/customer.effects';
import { MerchantsModule } from './pages/merchants/merchants.module';
import { MerchantslistEffects1 } from './store/merchantsList/merchantlist1.effect';
import { CouponsModule } from './pages/coupons/coupons.module';
import { CouponslistEffects } from './store/coupon/coupon.effect';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './core/helpers/auth.interceptor';
import { EmployeesModule } from './pages/employees/employees.module';
import { EmployeeslistEffects } from './store/employee/employee.effect';
import { StoresModule } from './pages/stores/stores.module';
import { StoreslistEffects } from './store/store/store.effect';
import { countrieslistEffects } from './store/country/country.effect';
import { AreaEffects } from './store/area/area.effect';
import { CityEffects } from './store/City/city.effect';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NotificationsEffects } from './store/notification/notification.effect';
import { NotificationsModule } from './pages/notifications/notifications.module';
import { RolesEffects } from './store/Role/role.effects';
import { SectionEffects } from './store/section/section.effect';
//import { ThemeService } from './core/services/theme.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ThemeService } from './core/services/theme.service';
import { CookieService } from 'ngx-cookie-service';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar'; // Arabic locale

// Register the Arabic locale
registerLocaleData(localeAr, 'ar');

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};



export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CyptolandingComponent
  ],
  imports: [
    NgxMaskDirective,
    NgxMaskPipe,
    DropzoneModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    LayoutsModule,
    MerchantsModule,
    CouponsModule,
    EmployeesModule,
    StoresModule,
    NotificationsModule,
    TranslateModule,
    AppRoutingModule,
    ExtrapagesModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    SharedModule,
    ScrollToModule.forRoot(),
    SlickCarouselModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      
      AuthenticationEffects,
 
      EmployeeslistEffects,
      CouponslistEffects,
      MerchantslistEffects1,
      StoreslistEffects,
      countrieslistEffects,
      CandidateEffects,
     
      CustomerEffects,
      AreaEffects,
      CityEffects,
      NotificationsEffects,
      RolesEffects,
      SectionEffects
      
    ]),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
   // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideAnimationsAsync('noop'),
    //{ provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'ar' } ,
    provideNgxMask(),
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }],
})
export class AppModule { 

  constructor(private translateService: TranslateService,private themeService: ThemeService,private cookieService: CookieService,) {
    // Set default language to Arabic ('ar')
    this.translateService.setDefaultLang('ar');
    this.cookieService.delete('lang');
    this.cookieService.set('lang', 'ar', { expires: 365, path: '/' })  
    this.translateService.use('ar');  // Automatically use Arabic on app load
    this.themeService.loadRtlStyles();

  }
}
