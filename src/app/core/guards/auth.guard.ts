import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authservice: AuthenticationService
    ) { }

    canActivate() {

        const currentUser = this.authservice.currentUserValue || localStorage.getItem('currentUser');
        
        // If user is logged in, navigate directly to the protected route
        if (currentUser) {
            //this.router.navigate(['/private']);
            console.log(currentUser);
            
            return of(true);
        }

        // User is not logged in, so immediately navigate to login without showing it
        // You can also add a timeout for a smooth transition (e.g., 200ms delay)
        setTimeout(() => {
            this.router.navigate(['/auth/login']);
        }, 0);  // We use a 0ms delay for immediate redirection
        
        return of(false);
    }
}
