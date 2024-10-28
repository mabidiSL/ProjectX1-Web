import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) { }

    
    loginAsOperator() {
      this.router.navigate(['/auth/login'], { queryParams: { userType: 'operator' } });
    }
  
    loginAsMerchant() {
      this.router.navigate(['/auth/login'], { queryParams: { userType: 'merchant' } });
    }
    
  
}
