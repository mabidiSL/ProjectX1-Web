import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {

  /**
   * Set a dynamic background image to a specific element
   * @param elementId The ID of the element to set the background for
   * @param imageUrl URL of the background image
   */
  setBackgroundElement(elementId: HTMLElement, imageUrl: string): void {
    elementId.style.backgroundImage = `url(${imageUrl})`;
    elementId.style.backgroundSize = 'cover';
    elementId.style.backgroundRepeat = 'no-repeat';
    elementId.style.backgroundPosition = 'center';
    }
  

  /**
   * Reset the background of a specific element
   * @param elementId The ID of the element to reset the background for
   */
  resetBackgroundElement(element: HTMLElement): void {
    element.style.backgroundImage = '';
   
  }
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
