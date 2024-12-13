import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { forgetPassword } from 'src/app/store/Authentication/authentication.actions';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { BackgroundService } from 'src/app/core/services/background.service';
import { RandomBackgroundService } from 'src/app/core/services/setBackgroundEx.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, OnDestroy {

  resetForm: FormGroup;
  loading$: Observable<boolean>

  submitted: boolean = false;
  error: string = '';
  success: string = '';
  loading: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, 
    private store: Store,
    private randomBackgroundService: RandomBackgroundService,
    private backgroundService: BackgroundService,
    public toastr:ToastrService) {   
          this.loading$ = this.store.pipe(select(selectDataLoading));
    }

  ngOnInit() {

    const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    this.randomBackgroundService.getRandomBackground(direction).subscribe(
      (randomImage) => {
        this.backgroundService.setBackground(randomImage);
      },
      (error) => {
        console.error('Error setting random background:', error);
      }
    );

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    this.store.dispatch(forgetPassword({ email: this.f.email.value }));
    
  }
  
  ngOnDestroy(): void {
    this.backgroundService.resetBackground();
  }
 
  }

