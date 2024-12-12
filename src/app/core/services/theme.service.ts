import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private rtlStylesheetId = 'rtl-stylesheet';
  constructor() { }

  // Load RTL stylesheet
  loadRtlStyles() {
    this.removeStylesheet(this.rtlStylesheetId); // Ensure no duplicate RTL stylesheets
    document.body.classList.add('rtl');
    document.documentElement.dir = 'rtl';         // Set the direction (dir) of HTML to RTL
    this.addStylesheet('assets/scss/rtl.scss', this.rtlStylesheetId); // Adjust the path as necessary
  }

  // Remove RTL stylesheet
  loadLtrStyles() {
    this.removeStylesheet(this.rtlStylesheetId);
    document.body.classList.remove('rtl');
    document.documentElement.dir = 'ltr';
    }


  private addStylesheet(href: string, id: string) {
    const head = document.head;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    head.appendChild(link);
  }

  private removeStylesheet(id: string) {
    const existingLink = document.getElementById(id);
    if (existingLink) {
      existingLink.remove();
    }
  }
}

