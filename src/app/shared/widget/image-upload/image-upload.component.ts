import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter<string>();
  @Input() disabled: boolean = false;
  @Input() existantImage: string = null;
  @Input() filename: string = '';
  @Input() alt: string = '';



   /**
   * File upload handler to emit the base64 encoded image
   */
   fileChange(event: any): void {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  /**
   * Convert file to base64
   */
  private convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      // Emit the result (base64 string) to the parent component
      this.imageUploaded.emit(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsDataURL(file);
  }
}