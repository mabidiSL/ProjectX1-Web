/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output,  ViewChild, ElementRef, OnInit } from '@angular/core';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})

export class ImageUploadComponent implements  OnInit {

  @Output() imageUploaded = new EventEmitter<UploadEvent>();
  @Output() logoUploaded = new EventEmitter<UploadEvent>();

  @Input() disabled: boolean = false;
  @Input() existantImage: string = null;
  @Input() filename: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() type: string = '';
  context: CanvasRenderingContext2D | null = null;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | undefined;


  @Input() alt: string = '';
  selectedFile: string | null = null;

  ngOnInit(): void {
    if (this.canvas) {
      this.context = this.canvas.nativeElement.getContext('2d');
    }
  }

   /**
   * File upload handler to emit the base64 encoded image
   */
   fileChange(event: Event): void {
     
      const inputElement = event.target as HTMLInputElement;
      if (inputElement && inputElement.files && inputElement.files[0]) {
        const file: File = inputElement.files[0];  // Get the first file
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
      this.selectedFile = reader.result as string
      if(this.type === 'logo'){
        this.logoUploaded.emit({file: this.selectedFile, type: this.type});
      }
      else if(this.type === 'image') {
        this.imageUploaded.emit({file: this.selectedFile, type: this.type});

      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsDataURL(file);
  }
   // Check if the file is an image
   isImage(file: any): boolean {
    if (!file) return false;
    const fileType = file.type.split('/')[0];
    return fileType === 'image';
  }
   // Check if the file is a PDF
   isPdf(file: any): boolean {
    if (!file) return false;
    return file.type === 'application/pdf';
   }

    // Render PDF preview (first page)
    renderPreview(file: File) {
      if (this.isPdf(file)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const typedArray = new Uint8Array(e.target.result);
          
          // Load the PDF document
          getDocument(typedArray).promise.then((pdf: PDFDocumentProxy) => {
            // Render the first page (you can change this to render any specific page)
            pdf.getPage(1).then((page) => {
              if (this.context && this.canvas) {
                // Set the scale factor for resizing the preview (change as needed)
                const scale = 0.5; // 50% of the original size
                const viewport = page.getViewport({ scale: scale });
  
                // Set canvas dimensions to match the scaled viewport size
                this.canvas.nativeElement.height = viewport.height;
                this.canvas.nativeElement.width = viewport.width;
  
                // Render the page on the canvas
                page.render({
                  canvasContext: this.context,
                  viewport: viewport,
                });
              }
            });
          });
        };
  
        // Read the uploaded file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
      }
    }
  
}
export interface UploadEvent {
  file: string;
  type: 'logo' | 'image';
}