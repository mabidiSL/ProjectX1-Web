/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output,  OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import intlTelInput from 'intl-tel-input';
import ar from 'intl-tel-input/i18n/ar';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrl: './phone-number.component.css'
})
export class PhoneNumberComponent implements  OnChanges, OnDestroy, AfterViewChecked {
  
  @Output() phoneNumberChanged = new EventEmitter<{ number: string; countryCode: string }>();
  @Input() initialPhoneNumber: string;
  @Input() disabled: boolean = false;
  @Input() inputId: string ;
  @Input() phoneCode?: string = null;


  
  @Input() placeholder: string;
  inputElement: HTMLInputElement;
  language: string = '';
  phone: FormControl; 
  itiOptions: any = {};
  iti: any;  // The intlTelInput instance
  errorMsg: HTMLElement;

  showError = (msg) => {
    this.errorMsg.innerHTML = msg; // Display the error message
    this.errorMsg.classList.remove('hide'); // Make sure the error message is visible
    this.inputElement.classList.add('error'); // Add the error class to highlight the input field
  };

// here, the index maps to the error code returned from getValidationError - see readme
 errorMap: string[] = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

  constructor(private formBuilder: FormBuilder, private cookieService: CookieService,private changeDetectorRef: ChangeDetectorRef) {
    
    this.phone = this.formBuilder.control(''); // Initialize the phone control
    this.itiOptions = {
      initialCountry: 'gb', // set default country as Saudi Arabia
      utilsScript: '/assets/js/utils.js'
      //'node_modules/intl-tel-input/build/js/utils.js', // for validation and formatting
     // loqdUtils: () => import('node_modules/intl-tel-input/build/js/utils.js'),
      //loadUtilsOnInit: 'intl-tel-input/utils'
    };

  }

  checkLanguageAndApplyRtl(): void {
    this.language = this.cookieService.get('lang'); 
    if (this.language === 'ar') {
      this.inputElement.setAttribute('dir', 'rtl'); 
      this.itiOptions.i18n = ar; 
    } 
    else {
      this.inputElement.setAttribute('dir', 'ltr');
      delete this.itiOptions.i18n;
    }
  }
  // ngOnChanges(changes: SimpleChanges): void {

  //   if (changes['initialPhoneNumber']) {
  //     // Reinitialize the intlTelInput if the initialPhoneNumber has changed
  //     if (this.initialPhoneNumber && this.initialPhoneNumber !== '') {
  //       //this.inputElement.value = this.initialPhoneNumber;
  //       this.iti.setNumber( this.initialPhoneNumber);
  //     }
  //          //this.initializeIntlTelInput();
  //   }
  //   if (this.phoneCode && this.phoneCode !== '') {
  //     console.log('Phone Code changed:', this.phoneCode);
  //     if(!this.inputElement){
  //       console.log('not initialized');
  //       this.initializeIntlTelInput();
  //     }
  //     this.iti.setCountry(this.phoneCode); // Update the country code
      
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phoneCode'] || changes['initialPhoneNumber']) {
      // If either phoneCode or initialPhoneNumber changes, update the intl-tel-input
      if (this.iti) {
        if (this.phoneCode) {
          this.iti.setCountry(this.phoneCode); // Update the country code
        }
        if (this.initialPhoneNumber) {
          this.iti.setNumber(this.initialPhoneNumber); // Set the initial phone number
        }
      } else {
        this.initializeIntlTelInput(); // Initialize if not already done
      }
    }
  }
  clearError(): void {
    if (this.errorMsg) {
      this.errorMsg.classList.add('hide'); // Hide the error message
      this.inputElement.classList.remove('error'); // Remove error class
      this.errorMsg.innerHTML = ''; // Clear error text
    }
  }
  ngAfterViewChecked(): void {
    // Ensure the input element is available after the view is checked
    this.errorMsg = document.querySelector('#error-msg');
 
    this.initializeIntlTelInput();
    }

  initializeIntlTelInput(): void {

    if (!this.inputElement && document.querySelector(`#${this.inputId}`)) {
      this.inputElement = document.querySelector(`#${this.inputId}`) as HTMLInputElement; 
      if(this.inputElement){
        if(this.disabled)
          this.inputElement.disabled = true;
          
      this.checkLanguageAndApplyRtl();
      this.iti = intlTelInput(this.inputElement, this.itiOptions);
      //console.log('Country data:', this.iti.getCountryData()); // Log the available country data

            if (this.initialPhoneNumber && this.initialPhoneNumber !== '') {
              this.inputElement.value = this.initialPhoneNumber;
              this.iti.setNumber( this.initialPhoneNumber);
            }
            // 
            if (this.phoneCode && this.phoneCode !== '') {
              this.iti.setCountry(this.phoneCode); // Update the country code
            }
            this.inputElement.addEventListener('input', () => {
              //const phoneNumber = this.inputElement.value.trim();
            
              // if (phoneNumber === '') {
              //   // Handle empty input
              //   console.log('Input is empty');
              //   this.clearError(); // Clear error message and class
              //   this.phoneNumberChanged.emit(''); // Emit empty value
              //   return;
              // }

              // try 
              // {
              //   this.iti.setNumber(phoneNumber); // Format the number as the user types
              // } 
              // catch (error) {
              //   console.warn('Formatting failed for:', phoneNumber, error);
              // }

              // Validate the current input without resetting the number
              if (this.iti.isValidNumber()) {
                this.clearError(); // Clear error messages
              } 
              else
              {
                const errorCode = this.iti.getValidationError();
                const msg = this.errorMap[errorCode] || 'Invalid number';
                this.showError(msg); // Show appropriate error message
              }

              const formattedNumber = this.iti.getNumber();
              const countryData = this.iti.getSelectedCountryData();
              const countryCode = countryData.dialCode;
          
                      // Emit the valid phone number with the country code
              this.phoneNumberChanged.emit({
                number: formattedNumber,
                countryCode: countryCode,
              });
              
            });
            
            this.changeDetectorRef.detach();
          
          }
          else
          {
            console.error('Phone input element not found.');
          } 
        }
        
      }
      
      ngOnDestroy(): void {
        if (this.iti) {
          this.iti.destroy();  // Cleanup intlTelInput when the component is destroyed
        }
      }
}