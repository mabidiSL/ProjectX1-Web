import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Remove Angular specific headers
    request = request.clone({
      headers: request.headers.delete('X-Requested-With')
    });

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Remove headers that might reveal frontend technology
          event = event.clone({
            headers: event.headers
              .delete('X-Powered-By')
              .delete('Server')
          });
        }
        return event;
      })
    );
  }
}
