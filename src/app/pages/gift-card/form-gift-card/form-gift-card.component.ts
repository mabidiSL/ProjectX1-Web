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
import { _User } from 'src/app/store/Authentication/auth.models';
import { selectDataLoading, selectedOffer } from 'src/app/store/offer/offer-selector';
import { addOfferlist, getOfferById, updateOfferlist } from 'src/app/store/offer/offer.action';
import { Offer } from 'src/app/store/offer/offer.model';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { selectData } from 'src/app/store/store/store-selector';
import { fetchStorelistData } from 'src/app/store/store/store.action';
import { Branch } from 'src/app/store/store/store.model';

@Component({
  selector: 'app-form-gift-card',
  templateUrl: './form-gift-card.component.html',
  styleUrl: './form-gift-card.component.css'
})
export class FormGiftCardComponent implements OnInit, OnDestroy{

  @Input() type: string;

  merchantList$: Observable<Merchant[]>;
  loading$: Observable<boolean>
  storeList$: Observable<Branch[]> | undefined ;
  storeList: Branch[] = [];
  formError: string | null = null;
  formSubmitted = false;

  selectedStores: Branch[]= [];
  merchantList: Merchant[] = [];
  existantOfferLogo: string = null;
  fileName: string = ''; 

  merchantId: number =  null;
  currentRole: string = '';

  fromPendingContext: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  public currentUser: Observable<_User>;

  dropdownSettings : any;
  formOffer: UntypedFormGroup;
  private destroy$ = new Subject<void>();
  OfferLogoBase64: string = null;
  originalOfferData: Offer = {};
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  isEditing = false;
  isLoading = false;


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
    this.bsConfig = {
      ...this.datepickerConfigService.getConfig(),
      isDisabled: this.type === 'view', // Disable the datepicker if in view mode
    };
    // this.datepickerConfigService.getConfig();

   
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.get('startDate')?.value);
    console.log(startDate);
    const endDate = new Date(control.get('endDate')?.value);
    console.log(endDate);

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
      name: [null, Validators.required],
      description: [null, Validators.required],
      termsAndConditions: [null, Validators.required],
      quantity: [null, Validators.required],
      company_id: [null, Validators.required],
      stores: [[]],
      category: ['gift-card'],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      image: [null,Validators.required],
      price: [null,Validators.required],
      giftCardValue: [null,Validators.required],
      discount:[null, Validators.required],
      status:['active']


    }, { validators: this.dateValidator });
  }
  ngOnInit() {
    this.merchantList$ = this.store.pipe(select(selectDataMerchant)); 
    this.merchantList$.subscribe(data => {
      if(data && data.length > 0){
          this.merchantList = [...data].map(merchant =>{
          const translatedName = merchant.translation_data && merchant.translation_data[0]?.name || 'No name available';
          return {
            ...merchant,  
            translatedName 
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
    }
  }
  );
  

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
  
     

    if(this.currentRole !== 'Admin'){
      this.formOffer.get('company_id').setValue(this.merchantId);
      this.formOffer.get('company_id').clearValidators()
      this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000,query:'', status:'', company_id: this.merchantId}));

      this.isLoading = true;
      }
    const OfferId = this.route.snapshot.params['id'];
    if (OfferId) {
      if (this.type === 'view') {
       this.formUtilService.disableFormControls(this.formOffer);
      }
      // Dispatch action to retrieve the Offer by ID
      this.store.dispatch(getOfferById({ OfferId }));
      // Subscribe to the selected Offer from the store
      this.store
        .pipe(select(selectedOffer), takeUntil(this.destroy$))
        .subscribe(Offer => {
          if (Offer) {
            
           
            //this.storeList$ = this.store.pipe(select(selectData));
            // Patch the form with Offer data
            this.existantOfferLogo = Offer.image;
            if(Offer.image){
              this.fileName = Offer.image.split('/').pop();
            }
            Offer.startDate = new Date(Offer.startDate);
            Offer.endDate = new Date(Offer.endDate);
            console.log(Offer);
            
            this.patchValueForm(Offer);
            this.originalOfferData = { ...Offer };
            this.isEditing = true;

          }
        });
    }
  
}
 // Method to disable all form controls
 disableFormControls() {
  Object.keys(this.formOffer.controls).forEach(key => {
    this.formOffer.get(key)?.disable();  // Disable the control
  });
}
patchValueForm(offer: Offer){
  this.formOffer.patchValue(offer);
  this.formOffer.get('company_id').setValue(offer.company_id);
  this.formOffer.get('stores').setValue(offer.stores.map(store => store.id));

  this.formOffer.patchValue({
    name: offer.translation_data[0].name,
   // name_ar: offer.translation_data[1]?.name,
    description: offer.translation_data[0].description,
   // description_ar: offer.translation_data[1]?.description,
    termsAndConditions: offer.translation_data[0].termsAndConditions,
   // termsAndConditions_ar: offer.translation_data[1]?.termsAndConditions,
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
      if (offer[key] === undefined || offer[key] === null) {
        delete offer[key];  // Delete property if it's undefined or null
      }
    });
    delete offer.name;  
   // delete offer.name_ar;    
    delete offer.description;
    //delete offer.description_ar;
    delete offer.termsAndConditions;
    //delete offer.termsAndConditions_ar;
 

  console.log(offer);
  return offer;

  
}
onSubmit(){

      this.formSubmitted = true;
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
     
      if(!this.isEditing)
      {         
          //Dispatch Action
          delete newData.id;
          newData = this.createOfferFromForm(newData);
          console.log(newData);
          this.store.dispatch(addOfferlist({ newData, offerType: 'gift-card' }));
      }
      else{
        const updatedDta = this.formUtilService.detectChanges(this.formOffer, this.originalOfferData);
        if (Object.keys(updatedDta).length > 0) {
          const changedData = this.createOfferFromForm(updatedDta);
          console.log(changedData);
          changedData.id =  this.formOffer.value.id;
          this.store.dispatch(updateOfferlist({ updatedData: changedData , offerType: 'gift-card'}));
        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
      
    }
    onApprove(){
      const coupon = {id: this.formOffer.value.id, status: 'active'}
      this.store.dispatch(updateOfferlist({ updatedData: coupon, offerType: 'gift-card' }));
  
     }   
    onDecline(){
      const coupon = {id: this.formOffer.value.id, status: 'refused'}
      this.store.dispatch(updateOfferlist({ updatedData: coupon, offerType: 'gift-card' }));
    }    
/**
 * Upload Offer Logo
 */
async uploadOfferLogo(event: any){
  if (event.type === 'logo') {
    this.existantOfferLogo = event.file;
    this.formOffer.controls['image'].setValue(event.file);
  } 
}
onToggle(event: any){
  console.log(event.target.value);
  if(event){
    this.formOffer.get('status').setValue(event.target.value === 'on'? 'inactive':'active');

  }
}
  onCancel(){
    this.formOffer.reset();
    this.router.navigateByUrl('/private/giftCards/list');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleViewMode(){

    
      this.router.navigateByUrl('/private/giftCards/list');

  }

  
}