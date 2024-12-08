/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef, OnChanges, OnInit  } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Claim } from 'src/app/store/Role/role.models';



@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasClaim]'
})
export class HasClaimDirective implements OnChanges, OnInit {

  @Input('hasClaim') claim: Claim[]; // Ensure claim is of type Claim

  //claims$: any[];
 
  
  public permissions: any[] = [];
  private isViewCreated = false;

  constructor(  private templateRef: TemplateRef<string>,     private authService: AuthenticationService,

    private viewContainerRef: ViewContainerRef) {
      
    
      
    }
  ngOnChanges(changes: SimpleChanges) {
   
      if (changes['claim'] && !changes['claim'].firstChange) {
        this.checkPermissions();
      }
    }
  
  private checkPermissions() {
    if (this.hasPermission(this.claim)) {
      if (!this.isViewCreated) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        this.isViewCreated = true;
      }
    } else {
      if (this.isViewCreated) {
        this.viewContainerRef.clear();
        this.isViewCreated = false;
      }
    }
  }

private hasPermission(claim: Claim[]): boolean {
 if (claim && this.permissions) {
       return claim.some(requiredClaim => 
         this.permissions.some(permission => 
           permission.claimType === requiredClaim.claimType && 
           requiredClaim.claimValue.some(value => permission.claimValue.includes(value))//should change this  from every to some
       ));
      }
    return false;
  }

 
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
      this.permissions = user.role.claims;
      this.checkPermissions();
    }});
  }
 
}
