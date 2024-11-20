import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from './theme.service';
import { changeLanguage } from 'src/app/store/layouts/layout.actions';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en','ar', 'es', 'de', 'it', 'ru'];

  constructor(private store: Store,public translate: TranslateService, private cookieService: CookieService, private themeService: ThemeService) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {

      browserLang = this.cookieService.get('lang');
      
      if(browserLang === 'ar'){
        this.themeService.loadRtlStyles();
      }
    }
    else {
      this.setLanguage('en');
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|ar|es|de|it|ru/) ? browserLang : 'en');

  }

  public setLanguage(lang) {
    this.cookieService.delete('lang');
    this.cookieService.set('lang', lang, { expires: 365, path: '/' })     
    this.translate.use(lang);

    if (lang === 'ar') {
      this.themeService.loadRtlStyles();
    }
    else 
    {
      this.themeService.loadLtrStyles();
    }
    this.store.dispatch(changeLanguage({ lang: lang }));
    
    //   document.body.classList.add('rtl');
    // } else {
    //   document.body.classList.remove('rtl');
    // }
   
  }

}
