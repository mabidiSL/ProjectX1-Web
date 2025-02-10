import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  private getCspDirectives(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://maps.googleapis.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add security headers and remove technology-revealing headers
    request = request.clone({
      headers: request.headers
        .delete('X-Requested-With')
        .set('X-Content-Type-Options', 'nosniff')
        .set('Content-Security-Policy', this.getCspDirectives())
    });

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Add security headers and remove technology-revealing headers in response
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
