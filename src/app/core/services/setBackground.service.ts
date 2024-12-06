import { Injectable } from '@angular/core';
import { ImageService } from './image.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RandomBackgroundService {
  constructor(private ImageService: ImageService) {}

  /**
   * Fetches a random background image URL based on the direction (LTR/RTL).
   * @param direction 'ltr' or 'rtl'
   * @returns Observable<string> containing the random image URL.
   */
  getRandomBackground(direction: 'ltr' | 'rtl'): Observable<string> {
    return this.ImageService.getImages(direction).pipe(
      map((images) => {
        if (images.length === 0) {
          throw new Error('No images available');
        }
        const randomIndex = Math.floor(Math.random() * images.length);
        console.log(images[randomIndex]);
        
        return images[randomIndex];
      }),
      catchError((error) => {
        console.error('Error fetching images or selecting random image:', error);
        return of('assets/images/home-background.jpg'); // Provide a fallback image URL
      })
    );
  }
}
