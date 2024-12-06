/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
//import { select, Store } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { DatepickerConfigService } from 'src/app/core/services/date.service';

//import { Observable } from 'rxjs';
// import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/payment/payment-selector';
// import { fetchPaymentlistData } from 'src/app/store/payment/payment.action';
//import { Payment } from 'src/app/store/payment/payment.model';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  breadCrumbItems: Array<object>;

  // PaymentList$: Observable<Payment[]>;
  // totalItems$: Observable<number>;
  // loading$: Observable<boolean>;
  
  // filteredArray: Payment[] = [];
  // originalArray: Payment[] = [];

  // itemPerPage: number = 10;
  // currentPage : number = 1;
  bsConfig: Partial<BsDatepickerConfig>;

  paymentForm: UntypedFormGroup;
  selectedFile: string| null = 'assets/images/Paypal.png';
  selectedFile1: string| null = 'assets/images/Stripe.png';
  selectedFile2: string| null = 'assets/images/flouci.png';


  constructor(public store: Store, 
   private datepickerConfigService: DatepickerConfigService,
   private formBuilder: UntypedFormBuilder,
  ) {
      
    // this.PaymentList$ = this.store.pipe(select(selectData)); // Observing the Payment list from Payment
    // this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
    // this.loading$ = this.store.pipe(select(selectDataLoading));
    this.bsConfig = this.datepickerConfigService.getConfig();
    this.initForm();

}

private initForm() {
  this.paymentForm = this.formBuilder.group({
    id: [null],
    apiVersion: [''],
    apiKey: [''],
    prod: [''],
    sandBox: [''],
    api_url: [''],
    publishedKey: [''],
    app_token: [''],
    app_secret: [''],
    clientId: [''],
    clientSecret: [''],
    accessToken: [''],
    logo: [''],
    payment_gateway_title: [''], 
    type: [''],// offline, online
    status: [''],//active, notActive
    status1: [''],//active, notActive
    status2: ['']//active, notActive


  });
}

ngOnInit() {
        console.log('Payment Methods');
        
      // this.store.dispatch(fetchPaymentlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage}));
      // this.PaymentList$.subscribe(data => {
      // this.originalArray = data; // Payment the full Payment list
      // this.filteredArray = [...this.originalArray];
      // document.getElementById('elmLoader')?.classList.add('d-none');
         
      // });
 }
 loadLogo(): string {
  const logo = this.paymentForm.get('logo')?.value;
  if (logo && logo.trim() !== '') {
    return logo;
  }
  return 'assets/images/dummy_image.jpg'; 
}
/**
   * File upload handler to emit the base64 encoded image
   */
fileChange(event: Event, method: string): void {
     
  const inputElement = event.target as HTMLInputElement;
  if (inputElement && inputElement.files && inputElement.files[0]) {
    const file: File = inputElement.files[0];  // Get the first file
    this.convertToBase64(file,method);  
  }

}

/**
* Convert file to base64
*/
private convertToBase64(file: File, method: string): void {
const reader = new FileReader();
reader.onload = () => {
  // Emit the result (base64 string) to the parent component
  if( method === 'flouci')
    this.selectedFile2 = reader.result as string;
  else if( method === 'paypal')
    this.selectedFile = reader.result as string;
  else
  this.selectedFile1 = reader.result as string;
  
  
};
reader.onerror = (error) => {
  console.error('Error reading file:', error);
};
reader.readAsDataURL(file);
}
onToggle(event: Event): void {
    // Get the checked state from the event
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Set the new value based on the checkbox state
    const newStatus = isChecked ? 'active' : 'inactive';
  
    // Update the form control value
    this.paymentForm.patchValue({ status: newStatus });
  
    // Optional: Log the result or perform additional actions
    console.log(`Status changed to: ${newStatus}`);
  }
  onToggle1(event: Event): void {
    // Get the checked state from the event
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Set the new value based on the checkbox state
    const newStatus = isChecked ? 'active' : 'inactive';
  
    // Update the form control value
    this.paymentForm.patchValue({ status1: newStatus });
  
    // Optional: Log the result or perform additional actions
    console.log(`Status changed to: ${newStatus}`);
  }
  onToggle2(event: Event): void {
    // Get the checked state from the event
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Set the new value based on the checkbox state
    const newStatus = isChecked ? 'active' : 'inactive';
  
    // Update the form control value
    this.paymentForm.patchValue({ status2: newStatus });
  
    // Optional: Log the result or perform additional actions
    console.log(`Status changed to: ${newStatus}`);
  }

}

