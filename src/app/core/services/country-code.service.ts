/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countryDataUrl = 'assets/country-code.json'; // Assuming the JSON is in the assets folder

  constructor(private http: HttpClient) {}

  getCountryData(): Observable<any[]> {
    return this.http.get<any[]>(this.countryDataUrl);
  }

  // This function will handle both ISO2 and country code searches
  getCountryByCodeOrIso(input: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      let result: string | null = null;
  
      // Check if the input is a number (country code) or an ISO2 code (string)
      const isNumeric = !isNaN(Number(input));
  
      if (isNumeric) {
        // Search by country code
        this.getCountryData().toPromise().then(data => {
          data.forEach(item => {
            // Check if country code is a single code or an array of codes
            if (Array.isArray(item[1])) {
              // If the item has multiple country codes, check if the country code is in the array
              if (item[1].includes(input)) {
                result = item[0]; // Return the ISO2 code
              }
            } else if (item[1] === input) {
              result = item[0]; // Return the ISO2 code if it's a direct match
            }
          });
          resolve(result); // Resolve the promise with the result
        }).catch(error => {
          reject(error); // If there's an error, reject the promise
        });
      } else {
        // If the input is not a numeric country code, treat it as an ISO2 code
        result = input;
        resolve(result); // Resolve the promise with the ISO2 code
      }
    });
  }
  
}
