import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { Observable } from 'rxjs';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { RandomBackgroundService } from 'src/app/core/services/setBackground.service';
import { BackgroundService } from 'src/app/core/services/background.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: UntypedFormGroup;
  submitted: boolean = false;
  loading$: Observable<boolean>;

  userType: string ='';
  error: string = '';
  returnUrl: string;
  fieldTextType!: boolean;

  // set the currenr year
  year: number = new Date().getFullYear();
  @ViewChild('leftsection') leftsection: ElementRef<HTMLElement>;
  isRtl: boolean = false;  // Default is LTR

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder,
    private randomBackgroundService: RandomBackgroundService,
    private backgroundService: BackgroundService,
    private renderer: Renderer2,
    private store: Store,
    ) { 
      this.loading$ = this.store.pipe(select(selectDataLoading));
    //   this.route.queryParams.subscribe(params => {
    //     this.userType = params['userType'];
    // });
  }

  ngOnInit() {
      this.isRtl = document.documentElement.dir === 'rtl';
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required]],
          password: ['', [Validators.required]],
      });
  //}

    const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    this.randomBackgroundService.getRandomBackground(direction).subscribe(
      (randomImage) => {
        this.backgroundService.setBackgroundElement(this.leftsection.nativeElement, randomImage);
      },
      (error) => {
        console.error('Error setting random background:', error);
      }
    );


    
    
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
    this.backgroundService.resetBackgroundElement(this.leftsection.nativeElement);
  }

 
}
