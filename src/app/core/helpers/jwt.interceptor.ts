/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserToken } from 'src/app/store/Authentication/authentication-selector';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private store: Store    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
       
        return this.store.select(selectUserToken).pipe(
            take(1),  // Ensure that the token is retrieved only once
            switchMap(token => {
              if (token) {
                const cloned = request.clone({
                  setHeaders: { 'x-auth-token': token }
                });
                return next.handle(cloned);
              } else {
                return next.handle(request);
              }
            })
          );
    }
}
