import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) {}

  private getCspDirectives(): string {
    const allowedUrls = this.configService.getAllowedUrls();
    const apiUrl = this.configService.getApiUrl();

    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      `connect-src 'self' ${allowedUrls.join(' ')} wss://${new URL(apiUrl).host}/socket.io/ ws://${new URL(apiUrl).host}/socket.io/`,
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
  }

  private hideStackHeaders(headers: any): any {
    // Only hide headers related to our stack (Angular/Node.js)
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
              // Use a generic server header
              .set('Server', 'Server')
          });
        }
        return event;
      })
    );
  }
}
