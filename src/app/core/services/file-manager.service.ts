// file-manager.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  constructor(private http: HttpClient) {}

  triggerDownload(file: any): void {
    // Create a direct download URL using the file's path
    const downloadUrl = `${environment.baseURL}/storage/files/${file.key}`;
    
    // Fetch the file as a blob
    this.http.get(downloadUrl, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        // Create a blob URL
        const url = window.URL.createObjectURL(blob);
        
        // Create and configure the download link
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name; // Set the file name for download
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      });
  }
}
