import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { Observable } from 'rxjs';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { RandomBackgroundService } from 'src/app/core/services/setBackgroundEx.service';
import { BackgroundService } from 'src/app/core/services/background.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  loginForm: UntypedFormGroup;
  submitted: boolean = false;
  loading$: Observable<boolean>;

  userType: string ='';
  error: string = '';
  returnUrl: string;
  fieldTextType!: boolean;

  // set the currenr year
  year: number = new Date().getFullYear();
  @ViewChild('rightsection') rightsection: ElementRef<HTMLElement>;
  isRtl: boolean = false;  // Default is LTR
  isloading: boolean = true;
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder,
    private randomBackgroundService: RandomBackgroundService,
    private backgroundService: BackgroundService,
    private renderer: Renderer2,
    private router: Router,
    private store: Store,
    ) { 
      this.loading$ = this.store.pipe(select(selectDataLoading));
      if (localStorage.getItem('currentUser')) {
        this.router.navigate(['/private']);
      }
      else
       this.isloading = false;
    //   this.route.queryParams.subscribe(params => {
    //     this.userType = params['userType'];
    // });
  }

  ngOnInit() {
      this.isRtl = document.documentElement.dir === 'rtl';
      
      //this.isloading = false;
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required]],
          password: ['', [Validators.required]],
      });
   
        
  }
  ngAfterViewInit() {

    const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    if (this.rightsection) {
      this.randomBackgroundService.getRandomBackground(direction).subscribe(
        (randomImage) => {
          this.backgroundService.setBackgroundElement(this.rightsection.nativeElement, randomImage);
        },
        (error) => {
          console.error('Error setting random background:', error);
        }
      );
    }
  
  }
  toggleRtl(): void {
    // Toggle between RTL and LTR
    const newDirection = this.isRtl ? 'ltr' : 'rtl';
    this.renderer.setAttribute(document.documentElement, 'dir', newDirection);
    this.isRtl = newDirection === 'rtl';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {  
    
    this.submitted = true;
    const email = this.f['email'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form

    // Login Api
    this.store.dispatch(login({ email: email, password: password }));
    

  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  

  ngOnDestroy(): void {
    if (this.rightsection && this.rightsection.nativeElement) {
        this.backgroundService.resetBackgroundElement(this.rightsection.nativeElement);
    }
  }

 
}
