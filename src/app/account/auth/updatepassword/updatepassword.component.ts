/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { updatePassword } from 'src/app/store/Authentication/authentication.actions';
import { ToastrService } from 'ngx-toastr';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrl: './updatepassword.component.scss'
})
export class UpdatepasswordComponent implements OnInit {

  public token: string;
  updatePassForm: UntypedFormGroup;
  submitted: any = false;
  loading$: Observable<any>

  error: any = '';
  returnUrl: string;
  fieldTextType: boolean  = false;
  confirmFieldTextType: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute,
    private store: Store,
    public toastr:ToastrService
) {
  this.loading$ = this.store.pipe(select(selectDataLoading));

 }

  ngOnInit() {
   
   this.token = this.route.snapshot.paramMap.get('id');
   
    // form validation
    this.updatePassForm = this.formBuilder.group({
      
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]

    }, {validators: [this.passwordMatchValidator]});
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    
    
    if (confirmPassword && newPassword !== confirmPassword) {
        formGroup.get('confirmPassword').setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
    
      formGroup.get('confirmPassword').setErrors(null);
   
    return null;
  }
  // convenience getter for easy access to form fields
  get f() { return this.updatePassForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    const pwd = this.f['password'].value; // Get the new password from the form

     // Update Password Api
     this.store.dispatch(updatePassword({ password: pwd , token: this.token}));
    
     

  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleConfirmFieldTextType() {
    this.confirmFieldTextType = !this.confirmFieldTextType;
  }
}
