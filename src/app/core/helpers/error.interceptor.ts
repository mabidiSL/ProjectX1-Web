/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router,private authService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 403) {
                return this.handle403Error(request, next);

              } else if (error.status === 401) {
                // Access denied
                console.error('Access denied:', error.message);
              } else {
                // General error handling
                console.error('An error occurred:', error.message);
              }
              return throwError(() => error);
            })
          );
        }
    private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
                const refreshToken = localStorage.getItem('refreshToken');  // Retrieve the refresh token
                if (refreshToken) {
                  // Call refresh token API
                  return this.authService.refreshToken(refreshToken).pipe(
                    switchMap((response: any) => {
                      // Store the new token
                      localStorage.setItem('token',response.result.accessToken);
                      
                      // Retry the original request with the new token
                      const clonedRequest = this.addTokenHeader(request, response.result.accessToken);
                      return next.handle(clonedRequest);
                     }),
                    catchError((error) => {
                      // Handle refresh token failure (e.g., logout the user)
                     
                      this.authService.clearSession();
                      //this.router.navigate(['/auth/login']);
                      location.reload();
                      return throwError(() => error);
                    })
                  );
                }
            
                // If no refresh token, logout the user
               // this.authService.logout();
               this.authService.clearSession();
                location.reload();
                return throwError(() => 'Refresh token not available.');
              }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
                return request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`,
                  },
                });
              }
    }
