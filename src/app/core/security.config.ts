import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders } from '@angular/common/http';
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
      `script-src 'self' 'strict-dynamic' 'nonce-${nonce}' https://maps.googleapis.com https://fonts.googleapis.com`,
      
      // Styles: Required for Angular
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com https://fonts.gstatic.com`,
      
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
      "require-trusted-types-for 'script'",
      
      // Frame ancestors restriction
      "frame-ancestors 'self'"
    ].filter(Boolean).join('; ');
  }

  private hideStackHeaders(headers: HttpHeaders): HttpHeaders {
    // List of headers that might reveal technology information
    const sensitiveHeaders = [
      'Server',
      'X-Powered-By',
      'X-AspNet-Version',
      'X-AspNetMvc-Version'
    ];

    let newHeaders = headers;
    sensitiveHeaders.forEach(header => {
      if (newHeaders.has(header)) {
        newHeaders = newHeaders.delete(header);
      }
    });

    return newHeaders;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is going to our API
    const isApiRequest = request.url.includes('legislative-eveleen-infiniteee-d57d0fbe.koyeb.app');
    
    // Remove any headers that might reveal technology information
    let headers = this.hideStackHeaders(request.headers);

    // Only add security headers for same-origin requests
    if (!isApiRequest) {
      headers = headers
        .set('X-Content-Type-Options', 'nosniff')
        .set('X-Frame-Options', 'SAMEORIGIN')
        .set('X-XSS-Protection', '0')
        .set('Cross-Origin-Opener-Policy', 'same-origin')
        .set('Cross-Origin-Resource-Policy', 'same-origin')
        .set('Referrer-Policy', 'strict-origin-when-cross-origin')
        .set('Content-Security-Policy', [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://fonts.googleapis.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' https://maps.googleapis.com https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app wss://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/socket.io/ ws://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/socket.io/",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "script-src-attr 'none'"
        ].join('; '));
    }

    // For API requests, ensure we include credentials
    if (isApiRequest) {
      request = request.clone({
        headers,
        withCredentials: true
      });
    } else {
      request = request.clone({ headers });
    }

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Remove response headers that might reveal technology information
          event = event.clone({
            headers: this.hideStackHeaders(event.headers)
          });
        }
        return event;
      })
    );
  }
}
