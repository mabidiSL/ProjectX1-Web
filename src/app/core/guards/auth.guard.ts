import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

            if (state.url === '/' || state.url === '/home') {
                return true; // Allow access to home
            }
            const currentUser = this.authFackservice.currentUserValue;
            if (currentUser) {
                // logged in so return true
                return true;
            }
            // check if user data is in storage is logged in via API.
            if (localStorage.getItem('currentUser')) {
                return true;
            }
        
        // not logged in so redirect to login page with the return url
       // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['/home']);
        return false;
    }
}
