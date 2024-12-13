import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate if the control is empty
    }

    const password = control.value;

    // Regular expressions for the checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 10;

    // Return an error object if validation fails
    if (minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      return null; // Valid password
    }

    return { 
      passwordStrength: true // Error key
    };
  };
}
