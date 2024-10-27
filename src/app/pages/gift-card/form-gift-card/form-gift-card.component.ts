import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import {  BehaviorSubject, Observable,  Subject, takeUntil } from 'rxjs';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { _User } from 'src/app/store/Authentication/auth.models';
import { selectDataLoading, selectGiftCardById } from 'src/app/store/giftCard/giftCard-selector';
import { addGiftCardlist, getGiftCardById, updateGiftCardlist } from 'src/app/store/giftCard/giftCard.action';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { selectData } from 'src/app/store/store/store-selector';
import { fetchStorelistData } from 'src/app/store/store/store.action';

@Component({
  selector: 'app-form-gift-card',
  templateUrl: './form-gift-card.component.html',
  styleUrl: './form-gift-card.component.css'
})
export class FormGiftCardComponent implements OnInit{

  @Input() type: string;

  merchantList$: Observable<any[]>;
  loading$: Observable<any>
  storeList$: Observable<any[]> | undefined ;

  formError: string | null = null;
  formSubmitted = false;

  selectedStores: any[]= [];
  merchantList: any[] = [];
  existantGiftCardLogo: string = null;
  fileName: string = ''; 

  merchantId: number =  null;
  currentRole: string = '';

  fromPendingContext: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;



  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;

  dropdownSettings : any;
  formGiftCard: UntypedFormGroup;
  private destroy$ = new Subject<void>();
  GiftCardLogoBase64: string = null;
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
      console.log(this.merchantId);

      if(this.currentRole !== 'Admin')
          this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10 ,status:'', merchant_id: this.merchantId}));
    this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 10 , status: 'active'})); 
    
    this.initForm();
    this.bsConfig = this.datepickerConfigService.getConfig();

   
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.get('startDateGiftCard')?.value);
    const endDate = new Date(control.get('endDateGiftCard')?.value);
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
  private getCurrentUser(): _User {
    // Replace with your actual logic to retrieve the user role
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser);
    return currentUser;
} 
  private initForm() {
    this.formGiftCard = this.formBuilder.group({
      id: [''],
      name_ar: ['', Validators.required],
      name: ['', Validators.required],
      description_ar: ['', Validators.required],
      description: ['', Validators.required],
      termsAndConditions_ar: [''],
      termsAndConditions: [''],
      quantity: ['', Validators.required],
      merchant_id: ['', Validators.required],
      stores: [[], Validators.required],
      managerName: [''],
      managerPhone: [''],
      startDateGiftCard: ['', Validators.required],
      endDateGiftCard: ['', Validators.required],
      sectionOrderAppearance: [''],
      categoryOrderAppearance: [''],
      giftCardImage: ['',Validators.required],
      giftCardValue: ['',Validators.required],
      discount:['']
      

    }, { validators: this.dateValidator });
  }
  ngOnInit() {
    

    this.merchantList$ = this.store.pipe(select(selectDataMerchant)); 
    this.merchantList$.subscribe(data => this.merchantList = data);

    this.storeList$ = this.store.pipe(select(selectData));

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
      this.formGiftCard.get('merchant_id').setValue(this.merchantId);
      this.isLoading = true;
      }
    const GiftCardId = this.route.snapshot.params['id'];
    console.log('GiftCard ID from snapshot:', GiftCardId);
    if (GiftCardId) {
      // Dispatch action to retrieve the GiftCard by ID
      this.store.dispatch(getGiftCardById({ GiftCardId }));
      // Subscribe to the selected GiftCard from the store
      this.store
        .pipe(select(selectGiftCardById(GiftCardId)), takeUntil(this.destroy$))
        .subscribe(GiftCard => {
          if (GiftCard) {
            console.log('Retrieved GiftCard:', GiftCard);
            
            if(this.currentRole == 'Admin'){
              this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10, status:'', merchant_id: GiftCard.merchant_id}));
            }
            this.storeList$ = this.store.pipe(select(selectData));
            // Patch the form with GiftCard data
            this.existantGiftCardLogo = GiftCard.giftCardImage;
            if(GiftCard.giftCardImage){
              this.fileName = GiftCard.giftCardImage.split('/').pop();
            }
            GiftCard.startDateGiftCard = this.formatDate(GiftCard.startDateGiftCard);
            GiftCard.endDateGiftCard = this.formatDate(GiftCard.endDateGiftCard);
            this.formGiftCard.patchValue(GiftCard);
          
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
getMerchantName(MerchantId: any){
  
  return this.merchantList.find(merchant => merchant.id === MerchantId)?.merchantName ;
  
}
private formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
}

getFileNameFromUrl(url: string): string {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1]; // Returns the last part, which is the filename
}

onChangeMerchantSelection(event: any){
  const merchant = event.target.value;
  console.log(merchant);
  if(merchant){
    this.isLoading = true;
    this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10 ,status:'', merchant_id: merchant}));
    this.storeList$ = this.store.pipe(select(selectData));
  }
   
}
onPhoneNumberChanged(phoneNumber: string) {
  console.log('PHONE NUMBER', phoneNumber);
  this.formGiftCard.get('managerPhone').setValue(phoneNumber);
}
  onSubmit(){

      this.formSubmitted = true;

      if (this.formGiftCard.invalid) {
        this.formError = 'Please complete all required fields.';
        Object.keys(this.formGiftCard.controls).forEach(control => {
          this.formGiftCard.get(control).markAsTouched();
        });
        this.focusOnFirstInvalid();
        return;
      }
      this.formError = null;
          
      const newData = this.formGiftCard.value;
           
      console.log(newData);
      newData.stores = this.formGiftCard.get('stores').value.map((store) =>(store.id ) );
      if(!this.isEditing)
      {
         
          //Dispatch Action
          delete newData.id;
          //console.log(newData.stores);
          this.store.dispatch(addGiftCardlist({ newData }));
      }
      else{

        this.store.dispatch(updateGiftCardlist({ updatedData: newData }));

      }
      
   
    }
      
    private focusOnFirstInvalid() {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  
    private getFirstInvalidControl(): HTMLInputElement | null {
      const controls = this.formGiftCard.controls;
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
 * Upload GiftCard Logo
 */
async uploadGiftCardLogo(event: any){
  try {
    const imageURL = await this.fileChange(event);
    console.log(imageURL);
    //this.signupForm.controls['storeLogo'].setValue(imageURL);
    this.existantGiftCardLogo = imageURL;
    this.formGiftCard.controls['giftCardImage'].setValue(imageURL);
  } catch (error: any) {
    console.error('Error reading file:', error);
  }
}



  onCancel(){
    this.formGiftCard.reset();
    this.router.navigateByUrl('/private/giftCards');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleViewMode(){

    if(this.fromPendingContext)
      this.router.navigateByUrl('/private/giftCards/approve');
    else
      this.router.navigateByUrl('/private/giftCards');

  }

  
}