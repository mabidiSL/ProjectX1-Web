/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, ViewChild } from '@angular/core';

import _ from 'lodash';
import { ChartType } from './profile.model';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';
import { updateProfile, updateProfilePassword } from 'src/app/store/Authentication/authentication.actions';
import { TranslateService } from '@ngx-translate/core';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { passwordValidator } from 'src/app/shared/validator/passwordValidator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent  {
  // bread crumb items
  breadCrumbItems: Array<object>;
  loading$: Observable<any>

  profileForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  fieldTextType: boolean= true;
  fieldTextType1: boolean= true;

  fieldTextType2: boolean= true;
  originalProfileData: any = null;
  passwordMatchError: boolean = false;


  passwordForm: UntypedFormGroup;
  revenueBarChart: ChartType;
  statData:any;
  submitted: any = false;

  public currentUser: _User;
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store, 
    public translate: TranslateService,
    private formUtilService: FormUtilService,
    private authService: AuthenticationService
  ) {
      
    this.loading$ = this.store.pipe(select(selectDataLoading));
  
    // fill up the form for updating the profile
    this.authService.currentUser$.subscribe(user =>{
      this.currentUser = user;
      this.originalProfileData = _.cloneDeep(user);

      this.profileForm = this.formBuilder.group({
        id: [user?.id],
        // name: [this.currentUserValue.user.name, [Validators.required]],
        f_name: [user?.translation_data[0].f_name, Validators.required],
        l_name: [user?.translation_data[0].l_name, Validators.required],
        jobTitle: [user?.jobTitle],
        email: [user?.email, [Validators.required, Validators.email]],
        phone:  [user?.phone, Validators.required],
        image:[user?.image]
      });
      this.imagePreview = (user?.image)? user?.image: null;
    this.passwordForm = this.formBuilder.group({
      id: [user?.id],
      currentPassword: ['', [Validators.required]],      
      newPassword: ['', [Validators.required,passwordValidator()]],
      confirmpwd:['', [Validators.required]],
    },{validators: [this.passwordMatchValidator]});
}); 
 
  }
  
// get passwordMatchError() {
//   return (
//     this.passwordForm.getError('passwordMismatch') &&
//     this.passwordForm.get('confirmpwd')?.touched
//   );
// }
onPhoneNumberChanged(event: { number: string; countryCode: string }) {
  this.profileForm.get('phone').setValue(event.number);
}
checkPasswordMatch() {
  const password = this.passwordForm.get('newPassword').value;
  const confirmPassword = this.passwordForm.get('confirmpwd').value;

  this.passwordMatchError = password !== confirmPassword;
}
passwordMatchValidator(formGroup: FormGroup) {
  const newPassword = formGroup.get('newPassword')?.value;
  const confirmPassword = formGroup.get('confirmpwd')?.value;

  if (newPassword && confirmPassword) {
    if (newPassword !== confirmPassword) {
      formGroup.get('confirmpwd')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; // Return an error object
    } else {
      formGroup.get('confirmpwd')?.setErrors(null); // Clear errors if they match
    }
  }

  return null; // Return null if valid
}
  
     /**
 * Password Hide/Show
 */
     toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
    toggleFieldTextType1() {
      this.fieldTextType1 = !this.fieldTextType1;
    }
    toggleFieldTextType2() {
      this.fieldTextType2 = !this.fieldTextType2;
    }
  
  createProfileFromForm(formValue): any {
    const profile = formValue;
    profile.translation_data = [];
    const enFields = [
      { field: 'f_name', name: 'f_name' },
      { field: 'l_name', name: 'l_name' },


    ];
    
   // Create the English translation if valid
    const enTranslation = this.formUtilService.createTranslation(profile,'en', enFields );
    if (enTranslation) {
      profile.translation_data.push(enTranslation);
    }
   
    
    if(profile.translation_data.length <= 0)
      delete profile.translation_data;
    // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(profile).forEach(key => {
      if (profile[key] === undefined || profile[key] === null) {
          delete profile[key];  // Delete property if it's undefined or null
       }
    });

   delete profile.f_name;  
   delete profile.l_name;  
   return profile;
}
  onSubmit() {
    this.formSubmitted = true;

      if (this.profileForm.invalid) {
        this.formError = 'Please complete all required fields.';
        Object.keys(this.profileForm.controls).forEach(control => {
          this.profileForm.get(control).markAsTouched();
        });
        this.focusOnFirstInvalid();
        return;
      }

      this.formError = null;
        const changedData =  this.createProfileFromForm(this.profileForm.value);
        
        delete changedData.email;  
        this.store.dispatch(updateProfile({ user: changedData }));
         
      
   
  }
private focusOnFirstInvalid() {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  
    private getFirstInvalidControl(): HTMLInputElement | null {
      const controls = this.profileForm.controls;
      for (const key in controls) {
        if (controls[key].invalid) {
          const inputElement = document.getElementById(key) as HTMLInputElement;
          if (inputElement) {
            return inputElement;
          }
        }
      }
      return null;
    }
    imagePreview: string | ArrayBuffer | null = null; // Holds the image preview URL

    onFileSelected(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result; // Set the image preview to the uploaded file
          this.profileForm.get('image').setValue(this.imagePreview);
        };
        reader.readAsDataURL(file);
      }
    }
  
    // convenience getter for easy access to form fields
    get f() { return this.passwordForm.controls; }

    /**
   * Submit the password
   */
  passwordFormSubmit() {

    this.submitted = true;
    if (this.profileForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.profileForm.controls).forEach(control => {
        this.profileForm.get(control).markAsTouched();
      });
      this.focusOnFirstInvalid();
      return;
    }

    this.formError = null;

      const currentPassword = this.f['currentPassword'].value;
      const newPassword = this.f['newPassword'].value;

      this.store.dispatch(updateProfilePassword({ oldPassword:currentPassword ,newPassword:newPassword}))  

    
  }
}
