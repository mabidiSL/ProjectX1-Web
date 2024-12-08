import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authservice: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

            // if (state.url === '/') {
            //     return true; // Allow access to home
            // }
            const currentUser = this.authservice.currentUserValue;
            console.log('i am in authGuard',currentUser);
            if (currentUser) {
                // logged in so return true
                return true;
            }
            // check if user data is in storage is logged in via API.
            if (localStorage.getItem('currentUser')) {
                return true;
            }
        
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
