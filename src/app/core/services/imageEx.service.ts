import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private images_ltr: string[] = [
    'assets/images/background/ltr_backgrd/background-ltr-1.webp',
    'assets/images/background/ltr_backgrd/background-ltr-2.webp',
    'assets/images/background/ltr_backgrd/background-ltr-3.webp',
    'assets/images/background/ltr_backgrd/background-ltr-4.webp',
    'assets/images/background/ltr_backgrd/background-ltr-5.webp',
    'assets/images/background/ltr_backgrd/background-ltr-6.webp',
    'assets/images/background/ltr_backgrd/background-ltr-7.webp',
    'assets/images/background/ltr_backgrd/background-ltr-8.webp',
    'assets/images/background/ltr_backgrd/background-ltr-9.webp',
    'assets/images/background/ltr_backgrd/background-ltr-10.webp',
  ];
  private images_rtl: string[] = [
    'assets/images/background/rtl_backgrd/background-rtl-1.webp',
    'assets/images/background/rtl_backgrd/background-rtl-2.webp',
    'assets/images/background/rtl_backgrd/background-rtl-3.webp',
    'assets/images/background/rtl_backgrd/background-rtl-4.webp',
    'assets/images/background/rtl_backgrd/background-rtl-5.webp',
    'assets/images/background/rtl_backgrd/background-rtl-6.webp',
    'assets/images/background/rtl_backgrd/background-rtl-7.webp',
    'assets/images/background/rtl_backgrd/background-rtl-8.webp',
    'assets/images/background/rtl_backgrd/background-rtl-9.webp',
    'assets/images/background/rtl_backgrd/background-rtl-10.webp',
  ];
  constructor() {}

  /**
   * Fetches background images based on the direction (LTR/RTL).
   * @param direction 'ltr' or 'rtl'
   */

  getImage(direction: string): string {
    const images =
      direction.toLowerCase() === 'ltr' ? this.images_ltr : this.images_rtl;
    const randomIndex = Math.floor(Math.random() * images.length);
    
    return images[randomIndex];
  }
}