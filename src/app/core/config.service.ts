import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  getApiUrl(): string {
    return AppConfig.apiUrl;
  }

  getAllowedUrls(): string[] {
    return [
      AppConfig.apiUrl,
      ...AppConfig.allowedDomains.map(domain => `https://${domain}`)
    ];
  }
}
