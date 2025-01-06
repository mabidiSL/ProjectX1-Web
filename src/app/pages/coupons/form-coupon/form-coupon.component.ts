/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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

import { selectedOffer, selectDataLoading } from 'src/app/store/offer/offer-selector';
import { addOfferlist, getOfferById, updateOfferlist } from 'src/app/store/offer/offer.action';
import { Offer } from 'src/app/store/offer/offer.model';
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

  existantofferLogo: string = null;
  fileName: string = ''; 

  fromPendingContext: boolean = false;

  merchantId: number =  null;
  currentRole: string = '';
  bsConfig: Partial<BsDatepickerConfig>;


  public currentUser: Observable<_User>;

  dropdownSettings : any;
  formOffer: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  private destroy$ = new Subject<void>();
  offerLogoBase64: string = null;
  isEditing = false;
  isLoading = false;
  originalOfferData: Offer = {};
  @ViewChild('formElement', { static: false }) formElement: ElementRef;




  constructor(
    private store: Store, 
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private datepickerConfigService: DatepickerConfigService,
    private authservice: AuthenticationService,
    private formUtilService: FormUtilService,
    private cdr: ChangeDetectorRef,
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
      this.setReadonlyConfig();

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
  setReadonlyConfig() {
    if (this.type === 'view') {
      this.bsConfig.isDisabled = true;  // Disable the datepicker
    } else {
      this.bsConfig.isDisabled = false;  // Enable the datepicker
    }
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.get('startDate')?.value);
    const endDate = new Date(control.get('endDate')?.value);
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
      // if (startDate < currentDate || endDate < currentDate) {
     
        
      //   return { invalidDate: true }; // Both dates must be >= current date
      // }
      if (startDate >= endDate) {
        return { dateMismatch: true }; // Start date must be before end date
      }
    }
    return null; // Valid
  }

  private initForm() {
    this.formOffer = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      termsAndConditions: ['', Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
      nbr_of_use: [null, Validators.required],
      company_id: [null, Validators.required],
      stores: [[]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      category: ['coupon'],
      contractRepName: [null],
      image: [null, Validators.required],
      couponType: ['free', Validators.required],// free,discountPercent,discountAmount,servicePrice checkboxes
      couponValueBeforeDiscount:[{ value: null, disabled: true }],
      couponValueAfterDiscount:[{ value: null, disabled: true }],
      discount: [{ value: null, disabled: true }],
      paymentDiscountRate: [null],
      status:['active']

    }, { validators: this.dateValidator });
  }
 
  ngOnInit() {

    this.formOffer.get('couponType').valueChanges.subscribe(value => {
      if (value === 'free') {
        console.log('Value of coupon', value);
        
        this.formOffer.get('discount').disable();
        this.formOffer.get('couponValueBeforeDiscount').disable();
        this.formOffer.get('couponValueAfterDiscount').disable();
      } else {
        if(value === 'discountPercent')
        this.formOffer.get('discount').enable();
        this.formOffer.get('couponValueBeforeDiscount').enable();
        this.formOffer.get('couponValueAfterDiscount').enable();
      }
      this.cdr.detectChanges();
    });
    if(this.currentRole !== 'Admin'){
      console.log(this.merchantId);
      this.formOffer.get('company_id').setValue(this.merchantId);
      this.formOffer.get('company_id').clearValidators()
      this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000,query:'', status:'', company_id: this.merchantId}));
      this.isLoading = true;
      
    }
     
    const offerId = this.route.snapshot.params['id'];
    if (offerId) {
      if (this.type === 'view') {
        this.formUtilService.disableFormControls(this.formOffer);
       }
      
      // Dispatch action to retrieve the offer by ID
      this.store.dispatch(getOfferById({ OfferId:  offerId}));
      // Subscribe to the selected offer from the store
      this.store
        .pipe(select(selectedOffer), takeUntil(this.destroy$))
        .subscribe(offer => {
          if (offer) {
          
            console.log(offer);
            
            this.existantofferLogo = offer.image;
            if(offer.image){
              this.fileName = offer.image.split('/').pop();
            }
            offer.startDate = new Date(offer.startDate);
            offer.endDate = new Date(offer.endDate);
            this.patchValueForm(offer);
            this.originalOfferData = { ...offer };
            this.isEditing = true;

          }
        });
    }
  
}
patchValueForm(offer: Offer){
  this.formOffer.patchValue(offer);
  this.formOffer.get('company_id').setValue(offer.company_id);
  this.formOffer.get('stores').setValue(offer.stores.map(store => store.id));
  this.formOffer.patchValue({
    name: offer.translation_data[0].name,
    description: offer.translation_data[0].description,
    termsAndConditions: offer.translation_data[0].termsAndConditions,
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
  this.formOffer.get('stores').setValue(null);
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
createOfferFromForm(formValue): Offer{
  const offer = formValue;
  offer.translation_data= [];
  const enFields = [
    { field: 'name', name: 'name' },
    { field: 'description', name: 'description' },
    { field: 'termsAndConditions', name: 'termsAndConditions' },

  ];
  // const arFields = [
  //   { field: 'name_ar', name: 'name' },
  //   { field: 'description_ar', name: 'description' },
  //   { field: 'termsAndConditions_ar', name: 'termsAndConditions' },


  // ];
  
  // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(offer,'en', enFields);
  if (enTranslation) {
    offer.translation_data.push(enTranslation);
  }

  // Create the Arabic translation if valid
  // const arTranslation = this.formUtilService.createTranslation(offer,'ar', arFields);
  // if (arTranslation) {
  //   offer.translation_data.push(arTranslation);
  // }
  if(offer.translation_data.length <= 0)
    delete offer.translation_data;

  // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(offer).forEach(key => {
      if (offer[key] === undefined || offer[key] === null || offer[key]==='') {
        delete offer[key];  // Delete property if it's undefined or null
      }
    });
    delete offer.name;  
    //delete offer.name_ar;    
    delete offer.description;
    //delete offer.description_ar;
    delete offer.termsAndConditions;
    //delete offer.termsAndConditions_ar;

  return offer;

  
}
  onSubmit(){

    this.formSubmitted = true;
    console.log(this.formOffer.value);

    if (this.formOffer.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.formOffer.controls).forEach(control => {
        this.formOffer.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.formOffer);
      return;
    }
      this.formError = null;
      let newData = this.formOffer.value;
      if(this.offerLogoBase64){
        newData.image = this.offerLogoBase64;
      }
      //newData.stores = this.formOffer.get('stores').value.map((store) =>(store.id ) );

      if(!this.isEditing)
      {
         delete newData.codeOffer;
         delete newData.id;
         newData = this.createOfferFromForm(newData);
         this.store.dispatch(addOfferlist({ newData, offerType:'coupon' }));
      }
      else
      {
        const updatedDta = this.formUtilService.detectChanges(this.formOffer, this.originalOfferData);
        if (Object.keys(updatedDta).length > 0) {
          const changedData = this.createOfferFromForm(updatedDta);
          changedData.id =  this.formOffer.value.id;
 
          this.store.dispatch(updateOfferlist({ updatedData: changedData, offerType:'coupon' }));
        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
      
   
    }
   onApprove(){
    const offer = {id: this.formOffer.value.id, status: 'active'}
    this.store.dispatch(updateOfferlist({ updatedData: offer , offerType:'coupon'}));

   }   
  onDecline(){
    const offer = {id: this.formOffer.value.id, status: 'refused'}
    this.store.dispatch(updateOfferlist({ updatedData: offer, offerType:'coupon' }));
  }
/**
 * Upload Offer Logo
 */
 uploadOfferLogo(event: UploadEvent): void{
  if (event.type === 'logo') {
    this.existantofferLogo = event.file;
    this.formOffer.controls['image'].setValue(this.existantofferLogo);
  }
}
onToggle(event: any){

  if(event){
    const newValue = event.target.checked ? 'active' : 'inactive';
    this.formOffer.get('status')?.setValue(newValue);

  }
}


  onCancel(){
    this.formOffer.reset();
    this.router.navigateByUrl('/private/coupons/list');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  toggleViewMode(){
    

    this.router.navigateByUrl('/private/coupons/list');

  }
  onChangeEventEmit(event: any){
    console.log(event);

  }
}