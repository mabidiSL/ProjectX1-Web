/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import {  Observable,  Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';

import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { _User } from 'src/app/store/Authentication/auth.models';

import { selectedCoupon, selectDataLoading } from 'src/app/store/coupon/coupon-selector';
import { addCouponlist, getCouponById, updateCouponlist } from 'src/app/store/coupon/coupon.action';
import { Coupon } from 'src/app/store/coupon/coupon.model';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { selectData } from 'src/app/store/store/store-selector';
import { fetchStorelistData } from 'src/app/store/store/store.action';
import { Branch } from 'src/app/store/store/store.model';

@Component({
  selector: 'app-form-coupon',
  templateUrl: './form-coupon.component.html',
  styleUrl: './form-coupon.component.scss'
})
export class FormCouponComponent implements OnInit, OnDestroy{

  @Input() type: string;

  merchantList$: Observable<Merchant[]>;
  loading$: Observable<boolean>;
  storeList$: Observable<Branch[]> | undefined ;

  selectedStores: any[];
  merchantList: Merchant[]= [];
  storeList: Branch[]= [];

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
  originalCouponData: Coupon = {};
  @ViewChild('formElement', { static: false }) formElement: ElementRef;




  constructor(
    private store: Store, 
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private datepickerConfigService: DatepickerConfigService,
    private authservice: AuthenticationService,
    private formUtilService: FormUtilService,
    private route: ActivatedRoute){
      
      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading)); 
     
      this.authservice.currentUser$.subscribe(user => {
        this.currentRole = user?.role.translation_data[0].name;
        this.merchantId =  user?.companyId;
        console.log(this.currentRole, 'and', this.merchantId);
        
      } );
      

      if(this.currentRole !== 'Admin')
          this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000 ,query:'',status:'', company_id: this.merchantId}));
      else
          this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000 ,query:'',status:'', company_id: null}));

      this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 100 ,query:'', status: 'active'})); 
      
      this.initForm();
      this.bsConfig = this.datepickerConfigService.getConfig();
      this.merchantList$ = this.store.pipe(select(selectDataMerchant)); // Observing the merchant list from store
    
      this.merchantList$.subscribe(data => {
        this.merchantList = [...data].map(country =>{
        const translatedName = country.translation_data && country.translation_data[0]?.name || 'No name available';
        return {
          ...country,  
          translatedName 
        };
      }).sort((a, b) => {
        // Sort by translatedName
        return a.translatedName.localeCompare(b.translatedName);
      });
      });
      this.store.pipe(select(selectData)).subscribe(data => {
        if(data && data.length > 0){
          this.storeList = [...data].map(store =>{
          const translatedName = store.translation_data && store.translation_data[0]?.name || 'No name available';
          return {
            ...store,  
            translatedName 
          };
        })
        .sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        })
       }
       
      });
         
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.get('startDateCoupon')?.value);
    const endDate = new Date(control.get('endDateCoupon')?.value);
    const currentDate = new Date();
     // Normalize currentDate to midnight (00:00:00)
    currentDate.setHours(0, 0, 0, 0);

    // Normalize startDate to midnight (00:00:00)
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }

    // Normalize endDate to midnight (00:00:00)
    if (endDate) {
      endDate.setHours(0, 0, 0, 0);
    }
 
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
      id: [null],
      name: ['', Validators.required],
      name_ar: [''],
      description: ['', Validators.required],
      description_ar: [''],
      termsAndConditions: ['', Validators.required],
      termsAndConditions_ar: [''],
      codeCoupon: ['COUP123'],
      quantity: [null, Validators.required],
      //nbr_of_use: [null, Validators.required],
      company_id: [null, Validators.required],
      stores: [[]],
      startDateCoupon: ['', Validators.required],
      endDateCoupon: ['', Validators.required],
      contractRepName: [''],
      sectionOrderAppearance: [null],
      categoryOrderAppearance: [null],
      couponLogo: ['', Validators.required],
      couponType: ['free', Validators.required],// free,discountPercent,discountAmount,servicePrice checkboxes
      couponValueBeforeDiscount:[''],
      couponValueAfterDiscount:[''],
      paymentDiscountRate: [''],
      status:['active']

    }, { validators: this.dateValidator });
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
    
    
    if(this.currentRole !== 'Admin'){
      console.log(this.merchantId);
      this.formCoupon.get('company_id').setValue(this.merchantId);
      this.formCoupon.get('company_id').clearValidators()
      this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000,query:'', status:'', company_id: this.merchantId}));
      this.isLoading = true;
      
    }
     
    const couponId = this.route.snapshot.params['id'];
    if (couponId) {
      // Dispatch action to retrieve the coupon by ID
      this.store.dispatch(getCouponById({ couponId }));
      // Subscribe to the selected coupon from the store
      this.store
        .pipe(select(selectedCoupon), takeUntil(this.destroy$))
        .subscribe(coupon => {
          if (coupon) {
          
            
            this.existantcouponLogo = coupon.couponLogo;
            if(coupon.couponLogo){
              this.fileName = coupon.couponLogo.split('/').pop();
            }
            
             this.patchValueForm(coupon);
            this.originalCouponData = { ...coupon };
            this.isEditing = true;

          }
        });
    }
  
}
patchValueForm(coupon: Coupon){
  this.formCoupon.patchValue(coupon);
  this.formCoupon.get('company_id').setValue(coupon.offer[0].company_id);
  this.formCoupon.get('stores').setValue(coupon.stores.map(store => store.id));
  this.formCoupon.patchValue({
    name: coupon.translation_data[0].name,
    name_ar: coupon.translation_data[1]?.name,
    description: coupon.translation_data[0].description,
    description_ar: coupon.translation_data[1]?.description,
    termsAndConditions: coupon.translation_data[0].termsAndConditions,
    termsAndConditions_ar: coupon.translation_data[1]?.termsAndConditions,
  });

}
private getNavigationState(){
  /**Determining the context of the routing if it is from Approved State or Pending State */
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.fromPendingContext = navigation.extras.state.fromPending ;
    }
}

getMerchantName(MerchantId: any){
    return this.merchantList.find(merchant => merchant.id === MerchantId)?.translation_data[0].name ;
  }
getFileNameFromUrl(url: string): string {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1]; // Returns the last part, which is the filename
}
fetchStore(id: number){
  this.store.pipe(select(selectData)).subscribe(data => {
    if(data && data.length > 0){
      this.storeList = [...data].map(store =>{
      const translatedName = store.translation_data && store.translation_data[0]?.name || 'No name available';
      return {
        ...store,  
        translatedName 
      };
    })
    .filter(store => store.company_id === id)
    .sort((a, b) => {
      // Sort by translatedName
      return a.translatedName.localeCompare(b.translatedName);
    })
   }
  });
}

onChangeMerchantSelection(event: Merchant){
  const merchant = event;
  this.storeList = [];
  this.formCoupon.get('stores').setValue(null);
  if(merchant){
    this.isLoading = true;
    this.store.pipe(select(selectData)).subscribe(data => {
    if(data && data.length > 0){
      this.storeList = [...data].map(store =>{
      const translatedName = store.translation_data && store.translation_data[0]?.name || 'No name available';
      return {
        ...store,  
        translatedName 
      };
    })
    .filter(store => store.company_id === merchant.id)
    .sort((a, b) => {
      // Sort by translatedName
      return a.translatedName.localeCompare(b.translatedName);
    })
   }
  });
   
}
}
createCouponFromForm(formValue): Coupon{
  const coupon = formValue;
  coupon.translation_data= [];
  const enFields = [
    { field: 'name', name: 'name' },
    { field: 'description', name: 'description' },
    { field: 'termsAndConditions', name: 'termsAndConditions' },

  ];
  const arFields = [
    { field: 'name_ar', name: 'name' },
    { field: 'description_ar', name: 'description' },
    { field: 'termsAndConditions_ar', name: 'termsAndConditions' },


  ];
  
  // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(coupon,'en', enFields);
  if (enTranslation) {
    coupon.translation_data.push(enTranslation);
  }

  // Create the Arabic translation if valid
  const arTranslation = this.formUtilService.createTranslation(coupon,'ar', arFields);
  if (arTranslation) {
    coupon.translation_data.push(arTranslation);
  }
  if(coupon.translation_data.length <= 0)
    delete coupon.translation_data;

  // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(coupon).forEach(key => {
      if (coupon[key] === undefined || coupon[key] === null || coupon[key]==='') {
        delete coupon[key];  // Delete property if it's undefined or null
      }
    });
    delete coupon.name;  
    delete coupon.name_ar;    
    delete coupon.description;
    delete coupon.description_ar;
    delete coupon.termsAndConditions;
    delete coupon.termsAndConditions_ar;

    

  return coupon;

  
}
  onSubmit(){

    this.formSubmitted = true;
    console.log(this.formCoupon.value);

    if (this.formCoupon.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.formCoupon.controls).forEach(control => {
        this.formCoupon.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.formCoupon);
      return;
    }
      this.formError = null;
      let newData = this.formCoupon.value;
      if(this.couponLogoBase64){
        newData.couponLogo = this.couponLogoBase64;
      }
      //newData.stores = this.formCoupon.get('stores').value.map((store) =>(store.id ) );

      if(!this.isEditing)
      {
         delete newData.codeCoupon;
         delete newData.id;
         newData = this.createCouponFromForm(newData);
      
         this.store.dispatch(addCouponlist({ newData }));
      }
      else
      {
        const updatedDta = this.formUtilService.detectChanges(this.formCoupon, this.originalCouponData);
        if (Object.keys(updatedDta).length > 0) {
          const changedData = this.createCouponFromForm(updatedDta);
          changedData.id =  this.formCoupon.value.id;
 
          this.store.dispatch(updateCouponlist({ updatedData: changedData }));
        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
      
   
    }
      

/**
 * Upload Coupon Logo
 */
 uploadCouponLogo(event: UploadEvent): void{
  if (event.type === 'logo') {
    this.existantcouponLogo = event.file;
    this.formCoupon.controls['couponLogo'].setValue(this.existantcouponLogo);
  }
}
onToggle(event: any){
  console.log(event.target.value);
  if(event){
    this.formCoupon.get('status').setValue(event.target.value === 'on'? 'inactive':'active');

  }
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
  onChangeEventEmit(event: any){
    console.log(event);

  }
}