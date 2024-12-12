// src/app/core/services/language-init.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './theme.service'; // Assuming you have a ThemeService for handling layout

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class LanguageInitService {
  constructor(
    private translate: TranslateService,
    private themeService: ThemeService
  ) {}

  initializeLanguage(): Promise<void> {
    return new Promise<void>((resolve) => {
      const browserLang = this.translate.getBrowserLang();
      if (browserLang === 'ar') {
        this.themeService.loadRtlStyles(); // RTL for Arabic
      } else {
        this.themeService.loadLtrStyles(); // LTR for English
      }
      console.log(document.documentElement.dir);
      
      resolve();
    });
}
}
