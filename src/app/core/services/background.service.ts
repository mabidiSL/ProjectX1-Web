import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {

  /**
   * Set a dynamic background image
   * @param imageUrl URL of the background image
   */
  setBackground(imageUrl: string): void {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  }

  /**
   * Reset the background to default
   */
  resetBackground(): void {
    document.body.style.backgroundImage = '';
  }
}
