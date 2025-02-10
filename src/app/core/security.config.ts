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

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't add security headers to requests to avoid CORS issues
    request = request.clone({
      headers: request.headers
        .delete('X-Requested-With')
    });

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Only add security headers to responses
          event = event.clone({
            headers: event.headers
              .delete('X-Powered-By')
              .delete('Server')
              .set('X-Content-Type-Options', 'nosniff')
              .set('X-Frame-Options', 'SAMEORIGIN')
              .set('X-XSS-Protection', '1; mode=block')
              .set('Referrer-Policy', 'strict-origin-when-cross-origin')
              .set('Content-Security-Policy', this.getCspDirectives())
          });
        }
        return event;
      })
    );
  }
}
