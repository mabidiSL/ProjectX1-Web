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
  
  @Output() phoneNumberChanged = new EventEmitter<string>();
  @Input() initialPhoneNumber: string;
  @Input() disabled: boolean = false;
  @Input() inputId: string ;
  
  @Input() placeholder: string;
  inputElement: HTMLInputElement;
  language: string = '';
  phone: FormControl; 
  itiOptions: any = {};
  iti: any;  // The intlTelInput instance


  constructor(private formBuilder: FormBuilder, private cookieService: CookieService,private changeDetectorRef: ChangeDetectorRef) {
    this.phone = this.formBuilder.control(''); // Initialize the phone control
    this.itiOptions = {
      initialCountry: 'sa', // set default country as Saudi Arabia
      //loadUtilsOnInit: 'node_modules/intl-tel-input/build/js/utils.js', // for validation and formatting
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialPhoneNumber']) {
      // Reinitialize the intlTelInput if the initialPhoneNumber has changed
      if (this.initialPhoneNumber && this.initialPhoneNumber !== '') {
        //this.inputElement.value = this.initialPhoneNumber;
        this.iti.setNumber( this.initialPhoneNumber);
      }
     
      //this.initializeIntlTelInput();
    }
  }
  ngAfterViewChecked(): void {
    // Ensure the input element is available after the view is checked
     this.initializeIntlTelInput();
    }

  initializeIntlTelInput(): void {

    if (!this.inputElement && document.querySelector(`#${this.inputId}`)) {
      this.inputElement = document.querySelector(`#${this.inputId}`) as HTMLInputElement; 
      if(this.inputElement){
      this.checkLanguageAndApplyRtl();
      this.iti = intlTelInput(this.inputElement, this.itiOptions);

            if (this.initialPhoneNumber && this.initialPhoneNumber !== '') {
              this.inputElement.value = this.initialPhoneNumber;
              this.iti.setNumber( this.initialPhoneNumber);
            }
            this.inputElement.addEventListener('input', () => {
              const phoneNumber = this.inputElement.value;
              this.phoneNumberChanged.emit(phoneNumber);
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