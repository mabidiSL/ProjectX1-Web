import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import {  Observable,  Subject, takeUntil } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { _User } from 'src/app/store/Authentication/auth.models';

import { selectCouponById, selectDataLoading } from 'src/app/store/coupon/coupon-selector';
import { addCouponlist, getCouponById, updateCouponlist } from 'src/app/store/coupon/coupon.action';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { selectData } from 'src/app/store/store/store-selector';
import { fetchStorelistData } from 'src/app/store/store/store.action';

@Component({
  selector: 'app-form-coupon',
  templateUrl: './form-coupon.component.html',
  styleUrl: './form-coupon.component.scss'
})
export class FormCouponComponent implements OnInit{

  @Input() type: string;

  merchantList$: Observable<any[]>;
  loading$: Observable<any>;
  storeList$: Observable<any[]> | undefined ;

  selectedStores: any[];
  merchantList: any[]= [];
  existantcouponLogo: string = null;
  fileName: string = ''; 

  fromPendingContext: boolean = false;

  merchantId: number =  null;
  currentRole: string = '';
  bsConfig: Partial<BsDatepickerConfig>;


  public currentUser: Observable<_User>;

  dropdownSettings : any;
  formCoupon: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  private destroy$ = new Subject<void>();
  couponLogoBase64: string = null;
  isEditing = false;
  isLoading = false;


  constructor(
    private store: Store, 
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private datepickerConfigService: DatepickerConfigService,
    private route: ActivatedRoute){
      
      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.currentRole = this.getCurrentUser()?.role.name;
      this.merchantId =  this.getCurrentUser()?.merchantId;

      if(this.currentRole !== 'Admin')
          this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10 ,status:'', merchant_id: this.merchantId}));
      
      this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 10 , status: 'active'})); 
      
      this.initForm();
      this.bsConfig = this.datepickerConfigService.getConfig();
         
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.get('startDateCoupon')?.value);
    const endDate = new Date(control.get('endDateCoupon')?.value);
    const currentDate = new Date();
  
    if (startDate && endDate) {
      // Check if both dates are valid
      if (startDate < currentDate || endDate < currentDate) {
        return { invalidDate: true }; // Both dates must be >= current date
      }
      if (startDate >= endDate) {
        return { dateMismatch: true }; // Start date must be before end date
      }
    }
    return null; // Valid
  }

  private initForm() {
    this.formCoupon = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      name_ar: [''],
      termsAndConditions: [''],
      termsAndConditions_ar: [''],
      codeCoupon: ['COUP123'],
      quantity: ['', Validators.required],
      nbr_of_use:['', Validators.required],
      merchant_id: ['', Validators.required],
      stores: [[], Validators.required],
      managerName: [''],
      managerPhone: [''],
      startDateCoupon: ['', Validators.required],
      endDateCoupon: ['', Validators.required],
      contractRepName: [''],
      sectionOrderAppearance: [''],
      categoryOrderAppearance: [''],
      couponLogo: ['', Validators.required],
      couponType: ['free', Validators.required],// free,discountPercent,discountAmount,servicePrice checkboxes
      couponValueBeforeDiscount:[''],
      couponValueAfterDiscount:[''],
      paymentDiscountRate: ['']

    }, { validators: this.dateValidator });
  }
  private getCurrentUser(): _User {
    // Replace with your actual logic to retrieve the user role
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
} 
  ngOnInit() {

    this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 10,
        allowSearchFilter: true
      };
    
    this.merchantList$ = this.store.pipe(select(selectDataMerchant)); // Observing the merchant list from store
    this.merchantList$.subscribe(data => this.merchantList = data);
    this.storeList$ = this.store.pipe(select(selectData));

    if(this.currentRole !== 'Admin'){
      this.formCoupon.get('merchant_id').setValue(this.merchantId);
      this.isLoading = true;
      
    }
     
    const couponId = this.route.snapshot.params['id'];
    if (couponId) {
      // Dispatch action to retrieve the coupon by ID
      this.store.dispatch(getCouponById({ couponId }));
      // Subscribe to the selected coupon from the store
      this.store
        .pipe(select(selectCouponById(couponId)), takeUntil(this.destroy$))
        .subscribe(coupon => {
          if (coupon) {
            if(this.currentRole == 'Admin'){
              this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10, status:'', merchant_id: coupon.merchant_id}));
            }
           
            this.storeList$ = this.store.pipe(select(selectData));
            // Patch the form with coupon data
            this.existantcouponLogo = coupon.couponLogo;
            if(coupon.couponLogo){
              this.fileName = coupon.couponLogo.split('/').pop();
            }
            coupon.startDateCoupon = this.formatDate(coupon.startDateCoupon);
            coupon.endDateCoupon = this.formatDate(coupon.endDateCoupon);
            this.formCoupon.patchValue(coupon);
          
            this.isEditing = true;

          }
        });
    }
  
}
private getNavigationState(){
  /**Determining the context of the routing if it is from Approved State or Pending State */
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.fromPendingContext = navigation.extras.state.fromPending ;
    }
}
private formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
}
getMerchantName(MerchantId: any){
    return this.merchantList.find(merchant => merchant.id === MerchantId)?.merchantName ;
  }
getFileNameFromUrl(url: string): string {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1]; // Returns the last part, which is the filename
}

onChangeMerchantSelection(event: any){
  const merchant = event.target.value;
  if(merchant){
    this.isLoading = true;
    this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10 ,status:'', merchant_id: merchant}));
    this.storeList$ = this.store.pipe(select(selectData));
  }
   
}
  onSubmit(){

    this.formSubmitted = true;

    if (this.formCoupon.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.formCoupon.controls).forEach(control => {
        this.formCoupon.get(control).markAsTouched();
      });
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
    
        
      const newData = this.formCoupon.value;
      if(this.couponLogoBase64){
        newData.couponLogo = this.couponLogoBase64;
      }
      
       
      newData.stores = this.formCoupon.get('stores').value.map((store) =>(store.id ) );

      if(!this.isEditing)
      {
         delete newData.codeCoupon;
         delete newData.id;
         this.store.dispatch(addCouponlist({ newData }));
      }
      else{
        this.store.dispatch(updateCouponlist({ updatedData: newData }));
      }
      
   
    }
      
    private focusOnFirstInvalid() {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  
    private getFirstInvalidControl(): HTMLInputElement | null {
      const controls = this.formCoupon.controls;
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
   * File Upload Image
   */
 
  
 async fileChange(event: any): Promise<string> {
  let fileList: any = (event.target as HTMLInputElement);
  let file: File = fileList.files[0];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload Coupon Logo
 */
async uploadCouponLogo(event: any){
  try {
    const imageURL = await this.fileChange(event);
    //
    this.existantcouponLogo = imageURL;
    this.formCoupon.controls['couponLogo'].setValue(imageURL);
  } catch (error: any) {
    console.error('Error reading file:', error);
  }
}


onPhoneNumberChanged(phoneNumber: string) {
  this.formCoupon.get('managerPhone').setValue(phoneNumber);
}
  onCancel(){
    this.formCoupon.reset();
    this.router.navigateByUrl('/private/coupons');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  toggleViewMode(){
    
    if(this.fromPendingContext){
      this.router.navigateByUrl('/private/coupons/approve');
    }
    else{
      this.router.navigateByUrl('/private/coupons');
    }

  }
 
}