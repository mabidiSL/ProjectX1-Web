/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  URL = 'assets/dashboard.json';
  url = 'assets/terms-conditions.html';

  constructor(private readonly http: HttpClient) { }
  getConfig(): Observable<any> {
    return this.http.get<any>(`${this.URL}`)
  }
  loadTermsAndConditions():Observable<any> {
    return this.http.get(`${this.url}`)
     
  }
}
