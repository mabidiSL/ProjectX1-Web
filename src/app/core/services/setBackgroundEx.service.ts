import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImageService } from './imageEx.service';

@Injectable({
  providedIn: 'root',
})
export class RandomBackgroundService {
  constructor(private imageService: ImageService) {}

  /**
   * Fetches a random background image URL based on the direction (LTR/RTL).
   * @param direction 'ltr' or 'rtl'
   * @returns Observable<string> containing the random image URL.
   */
  getRandomBackground(direction: 'ltr' | 'rtl'): Observable<string> {
    try {
      // Fetch the random image URL directly from the ImageService
      const randomImage = this.imageService.getImage(direction);
      return of(randomImage); // Wrap the result in an Observable
    } catch (error) {
      console.error('Error fetching random background:', error);
      // Return a fallback image URL wrapped in an Observable
      return of('assets/images/home-background.jpg');
    }
  }
}