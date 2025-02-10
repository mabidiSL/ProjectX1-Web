import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) {}

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private getCspDirectives(): string {
    const allowedUrls = this.configService.getAllowedUrls();
    const apiUrl = this.configService.getApiUrl();
    const nonce = this.generateNonce();

    // Store nonce in window object for Angular to use
    (window as any).__cspNonce = nonce;

    return [
      // Default fallback
      "default-src 'self'",
      
      // Scripts: Strict control over script execution
      `script-src 'self' 'strict-dynamic' https: 'unsafe-inline' https://maps.googleapis.com https://fonts.googleapis.com`,
      
      // Styles: Required for Angular
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      
      // Images with specific sources
      "img-src 'self' data: https: blob:",
      
      // Fonts with specific sources
      "font-src 'self' data: https://fonts.gstatic.com",
      
      // Connections: API and WebSocket
      `connect-src 'self' ${allowedUrls.join(' ')} wss://${new URL(apiUrl).host}/socket.io/`,
      
      // Frames: Strict control
      "frame-src 'self'",
      
      // Block plugins
      "object-src 'none'",
      
      // Base URI restriction
      "base-uri 'self'",
      
      // Form submissions
      "form-action 'self'",
      
      // Worker restrictions
      "worker-src 'self' blob:",
      
      // Manifest location
      "manifest-src 'self'",
      
      // Media restrictions
      "media-src 'self'",
      
      // Ensure upgraded HTTPS connections
      "upgrade-insecure-requests",
      
      // Report violations (if you have a reporting endpoint)
      environment.production ? "report-uri /csp-violation-report-endpoint" : null,
      
      // Require trusted types for script execution
      "require-trusted-types-for 'script'"
    ].filter(Boolean).join('; ');
  }

  private hideStackHeaders(headers: any): any {
    const techHeaders = [
      'x-powered-by',           // Node.js
      'server',                 // Could reveal Node.js
      'x-angular-version',      // Angular version
      'ng-version',            // Angular version
      'x-node-version',        // Node.js version
      'x-runtime',             // Runtime info
      'x-version',             // Version info
      'x-powered',             // General technology info
    ];

    techHeaders.forEach(header => {
      headers = headers.delete(header.toLowerCase());
    });

    return headers;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Hide technology headers from requests
    request = request.clone({
      headers: this.hideStackHeaders(request.headers)
        .set('X-Content-Type-Options', 'nosniff')
        .set('Content-Security-Policy', this.getCspDirectives())
    });

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Hide technology headers from response and add security headers
          event = event.clone({
            headers: this.hideStackHeaders(event.headers)
              .set('X-Content-Type-Options', 'nosniff')
              .set('X-Frame-Options', 'SAMEORIGIN')
              .set('X-XSS-Protection', '1; mode=block')
              .set('Referrer-Policy', 'strict-origin-when-cross-origin')
              .set('Content-Security-Policy', this.getCspDirectives())
              .set('Server', 'Server')
          });
        }
        return event;
      })
    );
  }
}
