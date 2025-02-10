/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class FormUtilService{
private toastr: ToastrService;
    /**
   * Focuses on the first invalid control in the form.
   * @param form The FormGroup instance to check for invalid controls.
   */
 focusOnFirstInvalid(form: FormGroup): void {
    const firstInvalidControl = this.getFirstInvalidControl(form);
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  /**
   * Finds the first invalid control in the form.
   * @param form The FormGroup instance to check for invalid controls.
   * @returns The first invalid control element or null if none found.
   */
  getFirstInvalidControl(form: FormGroup): HTMLInputElement | null {
    const controls = form.controls;
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
   /**
   * Checkes for changed Fields.
   * @param form The FormGroup instance  and the originl Data to be compared with.
   * @returns The only changes fields in an object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detectChanges<T>(form: FormGroup, data: T): Partial<T> {
    const changedData: Partial<T> = {};
    
 
    // Compare each field and add only the modified fields
    for (const key in form.controls) {
      if(key.includes('Logo') ){
                if (form.controls[key].value && form.controls[key].value !== data[key]) {
          changedData[key] = form.controls[key].value;
        }
        continue;
      }
      if(key.includes('image')){
        if(data[key]!== undefined){
          if (form.controls[key].value !== data[key]) {
            changedData[key] = form.controls[key].value;
          }
        }
        else{
        if (form.controls[key].value !== data['user'][key]) {
          changedData[key] = form.controls[key].value;
        }
        }
        continue;
      }
      if(key.includes('phone') ||key.includes('Phone')|| key.includes('Tel')){
        if(data[key]){
          if (form.controls[key].value !== data[key]) {
            changedData[key] = form.controls[key].value;
          }
        }else
        {
          if (form.controls[key].value !== data['user'][key]) {
            changedData[key] = form.controls[key].value;
          }
        }
      }
      if (form.controls[key].dirty) {
        // Check if the value is different from the original
        
        if (form.controls[key].value !== data[key]) {
            changedData[key] = form.controls[key].value;
        }
      
      }
    }
    return changedData;
  }
/**
 * Scroll Up to the Top of the Form to show the warning message
 * @param formElement 
 */
  scrollToTopOfForm(formElement: ElementRef): void {
    // First, scroll to the form element (or to the input element at the top)
    if (formElement) {
     
        window.scrollTo({
        top: formElement.nativeElement.offsetTop - 50, // Scroll position minus offset for margin/padding if needed
        behavior: 'smooth', // Smooth scroll
      });
    }

    
  }
  /***
   * Creates Translated Objects
   */
  createTranslation (formValue: any,language: string, fields: {field: string, name: string}[]): any  {
    const translation: any = { language };

    fields.forEach(({ field, name }) => {
      if (formValue[field]) {
        translation[name] = formValue[field];
      }
    });
    // Only return the translation if it has at least one valid property (other than 'language')
    return Object.keys(translation).length > 1 ? translation : null;
  }
/***
   * Creates getErrorMessage
   */
getErrorMessage(error: any): string {
  // Implement logic to convert backend error to user-friendly message
  if (error?.status === 400) {
    if (error?.error && error?.error?.result && Array.isArray(error?.error?.result?.error)) {
      // Extract the first validation error message from the list
      return error?.error?.result?.error?.map(err => `${err?.path}: ${err?.message}`).join(', ');
    }
    return 'Bad Request: Validation error';
  }
  else if (error?.error && error?.error?.result && typeof error?.error?.result?.error === 'string') {
  // If error.result is a string, return it directly
  return error?.error?.result?.error;
} else if (error?.message) {
  // Generic error message fallback
  return error?.message;
}
return 'An unknown error occurred';
}
  //  getErrorMessage(error: any): string {
  //   // Implement logic to convert backend error to user-friendly message
  //   if (error?.status === 400) {
  //     if (error?.error && error?.error?.result && Array.isArray(error?.error?.result?.error)) {
  //       //this.toastr.error(error.error.result.error.map(err => `${err.path}: ${err.message}`).join(', '));
  //       this.toastr.error('123');
  //       // Extract the first validation error message from the list
  //       return error?.error?.result?.error?.map(err => `${err?.path}: ${err?.message}`).join(', ');
  //     }
  //     this.toastr.error('Bad Request: Validation error');
  //     return 'Bad Request: Validation error';
  //   }
  //   else{
  //     console.log('HANDLING ERRORS',error);
      
  //     if (error?.error && error?.error?.result && typeof error?.error?.result?.error === 'string') {
  //       console.log('FIRST IF ERROR',error);

  //     if (error?.error?.result?.error !== 'Token expired' && error?.error?.result?.error !== 'Invalid refresh token') {
  //       console.log('SECOND IF ERROR',error?.error?.result?.error);
  //       this.toastr.error(error?.error?.result?.error);
  //     }  
  //     // If error.result is a string, return it directly
  //        return error?.error?.result?.error;
  //     } else if (error?.message) {
  //       console.log('ELSE ERROR',error);
        
  //       if (error?.message !== 'Token expired' && error?.message !== 'Invalid refresh token') {
  //         this.toastr.error(error?.message);
  //       }  
  //       // Generic error message fallback
  //       return error?.message;
  //     }
  // return 'An unknown error occurred';
  // }}
  // getErrorMessage(error: any): string {
  //   // Implement logic to convert backend error to user-friendly message
  //   if (error.status === 400) {
  //     if (error.error && error.error.result && Array.isArray(error.error.result.error)) {
  //       // Extract the first validation error message from the list
  //       return error.error.result.error.map(err => `${err.path}: ${err.message}`).join(', ');
  //     }
  //     return 'Bad Request: Validation error';
  //   }
  //   else if (error.error && error.error.result && typeof error.error.result === 'string') {
  //   // If error.result is a string, return it directly
  //   return error.error.result;
  // } else if (error.message) {
  //   // Generic error message fallback
  //   return error.message;
  // }
  // return 'An unknown error occurred';
  // }

   // Method to disable all form controls
   disableFormControls(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.disable();  // Disable the control
    });
  }
}