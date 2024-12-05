import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/api/images';

  /**
   * Fetches background images based on the direction (LTR/RTL).
   * @param direction 'ltr' or 'rtl'
   */
  getImages(direction:string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${direction}`);
  }
}
