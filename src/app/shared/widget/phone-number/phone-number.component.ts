import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrl: './phone-number.component.css'
})
export class PhoneNumberComponent {
  
  @Output() phoneNumberChanged = new EventEmitter<string>();
  @Input() initialPhoneNumber: string;
  @Input() disabled: boolean = false;
  phone: FormControl; // Define the phone property as a FormControl

  constructor(private formBuilder: FormBuilder) {
    this.phone = this.formBuilder.control(''); // Initialize the phone control
  }
  ngAfterViewInit() {

   const input = document.querySelector('#phoneInput') as HTMLInputElement;
   const iti = intlTelInput(input, {
      initialCountry: 'sa', 
      //preferredCountries: ['us', 'gb', 'fr'] as any, // add preferred countries
      utilsScript: 'node_modules/intl-tel-input/build/js/utils.js' // for validation and formatting
    });

    if (this.initialPhoneNumber) {
      input.value = this.initialPhoneNumber;
      iti.setNumber( this.initialPhoneNumber);
    }
    input.addEventListener('input', () => {
      const phoneNumber = input.value;
      this.phoneNumberChanged.emit(phoneNumber);
    });
 

  }
  
}