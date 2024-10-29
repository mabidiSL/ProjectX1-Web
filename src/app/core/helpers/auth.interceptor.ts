import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../../core/services/token-storage.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthfakeauthenticationService } from '../services/authfake.service';

// const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'x-auth-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthfakeauthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');  // Adjust the key as needed

      if (token) {
            const clonedRequest = this.addTokenHeader(request, token);
            return next.handle(clonedRequest).pipe(
                catchError((error: HttpErrorResponse) => {
                // If the error is a 401 (Unauthorized), attempt to refresh the token
                if (error.status === 401) {
                    return this.handle401Error(request, next);
                }
                return throwError(() => error);;
                })
            );
         }
          return next.handle(request);
      }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        const refreshToken = localStorage.getItem('refreshToken');;  // Retrieve the refresh token
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
              this.authService.logout();
              location.reload();
              return throwError(() => error);;
            })
          );
        }
    
        // If no refresh token, logout the user
        this.authService.logout();
        location.reload();
        return throwError(() => 'Refresh token not available.');
      }
  }
 

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];