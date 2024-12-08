/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import {  catchError, map, Observable, of, take } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    claims: any[] = [];
    constructor( private router: Router ,private authService: AuthenticationService 
    ) { 
   
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
 
         return this.authService.currentUser$.pipe(
          take(1), // Take the first value of the observable and complete it
          map(user => {
              if (user) {
                  const claims = user.role?.claims || [];
                  
                  if (claims.length === 0) {
                    this.router.navigate(['/pages/403']);
                    return false; // No claims, deny access
                  }
                  const requiredClaim = route.data?.['claim'];

                  if (!requiredClaim) {
                      return true; // No permission required, allow access
                  }

                  const hasRequiredClaims = requiredClaim.some(required => {
                      return claims.some(claim => {
                          return claim.claimType === required.claimType &&
                              required.claimValue.some(value => claim.claimValue.includes(value));
                      });
                  });

                  return hasRequiredClaims;
              } else {
                  this.router.navigate(['/auth/login']);
                  return false; // User is not authenticated
              }
          }),
          catchError(() => {
              this.router.navigate(['/pages/403']);
              return of(false); // In case of error (e.g. no user data), deny access
          })
      );
        
        }
    
 
}
