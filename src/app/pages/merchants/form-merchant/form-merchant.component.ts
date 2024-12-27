/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { addMerchantlist,  getMerchantById,  updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectedMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { Merchant } from '../../../store/merchantsList/merchantlist1.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
//import { Area } from 'src/app/store/area/area.model';
import { City } from 'src/app/store/City/city.model';
import { Country } from 'src/app/store/country/country.model';
import { SectionListModel } from 'src/app/store/section/section.model';


@Component({
  selector: 'app-form-merchant',
  templateUrl: './form-merchant.component.html',
  styleUrl: './form-merchant.component.css'
})
export class FormMerchantComponent implements OnInit, OnDestroy {
  
  @Input() type: string;
  merchantForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  private destroy$ = new Subject<void>();

  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  merchant: Merchant = null;
  imageURL: string | undefined;
  existantcompanyLogo: string = null;
  existantmerchantPicture: string = null
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  isEditing: boolean = false;
  fromPendingContext: boolean = false;
  filteredCities:  City[] = [];

  countrylist: Country[] = [];
  
  loading$: Observable<boolean>;

  sectionlist:  SectionListModel[] = [];
  
  filteredCountries: Country[] = [];

  originalMerchantData: Merchant = {}; 

  fieldTextType: boolean  = false;
  confirmFieldTextType: boolean = false;
  @ViewChild('formTop', { static: false }) formTop: ElementRef;
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {

      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000,query:'', status: 'active' }));
     // this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 1000, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10000, query:'',status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
     
      this.initForm();
      
     }

   
   private initForm() {
    this.merchantForm = this.formBuilder.group({
    id: [null],
    f_name: ['', Validators.required],
    l_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone:[null,Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
    country_id:[null, Validators.required],
    city_id:[null],
    jobTitle: [null],
    //area_id:[null, Validators.required], 
    bankAccountNumber: [null],
    merchantName:['', Validators.required],
    //merchantName_ar:[''],
    image: [null],
    companyLogo: [null, Validators.required],
    activationCode: [''],
    qrCode: [''],
    officeTel: [''],
    section_id:[null, Validators.required],
    website: [undefined],
    whatsup:[null],
    facebook: [undefined],
    twitter: [undefined],
    instagram: [undefined],
    status:['active']

    

  });} 
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 
  globalId : number = null;

  ngOnInit() {
        
    this.fetchCountry();
    //this.fetchAreas();
    this.fetchCities();
    this.fetchSection();

    const merchantId = this.route.snapshot.params['id'];
    if (merchantId) {
      if (this.type === 'view') {
        this.formUtilService.disableFormControls(this.merchantForm);
       }
      // Dispatch action to retrieve the merchant by ID
      this.store.dispatch(getMerchantById({ merchantId }));
      
      // Subscribe to the selected merchant from the store
      this.store
        .pipe(select(selectedMerchant), takeUntil(this.destroy$))
        .subscribe((merchant: Merchant) => {
          if (merchant) {
            console.log(merchant);

            this.globalId = merchant.id;
            this.patchValueForm(merchant);
            this.merchantForm.controls['country_id'].setValue(merchant.user.country_id);
           // this.merchantForm.controls['area_id'].setValue(merchant.user.city.area_id);
            this.originalMerchantData = { ...merchant };

            this.isEditing = true;
            if(merchant.companyLogo){
              this.existantcompanyLogo = merchant.companyLogo;
              this.fileName1 = merchant.companyLogo.split('/').pop();

            }
            if(merchant.merchantPicture){
              this.existantmerchantPicture = merchant.merchantPicture;
              this.fileName2 = merchant.merchantPicture.split('/').pop();
            }
                              
            
          }
        });
    }
   
  }
  patchValueForm(merchant: Merchant){
    this.merchantForm.patchValue(merchant);
    this.merchantForm.patchValue(merchant.user);
    this.merchantForm.patchValue({
      f_name: merchant.user.translation_data[0].f_name,
      l_name: merchant.user.translation_data[0].l_name,
      merchantName: merchant.translation_data[0].name,
      //merchantName_ar: merchant.translation_data[1].name,
      //supervisorName_ar: merchant.translation_data[1].supervisorName,
      
    });
  
  }
  fetchCountry(){
    this.store.select(selectDataCountry).subscribe((data) =>{
      this.filteredCountries = [...data].map(country =>{
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
  }
  fetchSection(){
    this.store.select(selectDataSection).subscribe((data) => {
      this.sectionlist = [...data].map(section => {
        // Extract the translated name (assuming translation_data[0] exists)
        const translatedName = section.translation_data && section.translation_data[0]?.name || 'No name available';
    
        return {
          ...section,  // Spread the original section data
          translatedName // Add the translatedName property for easy binding
        };
      }).sort((a, b) => {
        // Sort by translatedName
        return a.translatedName.localeCompare(b.translatedName);
      });
    });

  }
  
  fetchCities(){
    this.store.select(selectDataCity).subscribe((data) => {
      this.filteredCities = [...data].map(city =>{
       const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
   
       return {
         ...city,  
         translatedName 
       };
     })
     .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
     });
   });
  }
  private getNavigationState(){
    /**Determining the context of the routing if it is from Approved State or Pending State */
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.fromPendingContext = navigation.extras.state.fromPending ;
      }
  }


  onChangeCountrySelection(event: Country){
    const country = event;
    console.log(country);
    
    if(country){
      
      this.filteredCities = [];
      this.merchantForm.get('city_id').setValue(null);
      this.store.select(selectDataCity).subscribe((data) => {
        this.filteredCities = [...data].map(city =>{
         const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
     
         return {
           ...city,  
           translatedName 
         };
       })
       .filter(city => city.country_id === country.id)
       .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
       });
     });
    }
   
    
  }
  setCountryByPhoneCode(code: string){
    console.log(this.filteredCountries);
    const country = this.filteredCountries.find(c => c.phoneCode === code);
    console.log(country);
    this.merchantForm.get('country_id').setValue(country?.id);
    this.onChangeCountrySelection(country);
  }
  onMerchantPhoneNumberChanged(event: { number: string; countryCode: string }){
    this.merchantForm.get('officeTel').setValue(event.number);
    if(this.type === 'create'){
      this.setCountryByPhoneCode(event.countryCode);
    }
  }
  onPhoneNumberChanged(event: { number: string; countryCode: string }) {

    this.merchantForm.get('phone').setValue(event.number);
   
  }

  // convenience getter for easy access to form fields
  get f() { return this.merchantForm.controls; }

 createMerchantFromForm(formValue): Merchant {
      const merchant = formValue;
      merchant.translation_data = [];
      const enFields = [
        { field: 'merchantName', name: 'name' },
        { field: 'f_name', name: 'f_name' },
        { field: 'l_name', name: 'l_name' },
       // { field: 'supervisorName', name: 'supervisorName' }
      ];
      // const arFields = [
      //   { field: 'merchantName_ar', name: 'name' },
      //   { field: 'supervisorName_ar', name: 'supervisorName' }
      // ];
     // Create the English translation if valid
      const enTranslation = this.formUtilService.createTranslation(merchant,'en', enFields );
      if (enTranslation) {
        merchant.translation_data.push(enTranslation);
      }
     
      // // Create the Arabic translation if valid
      // const arTranslation = this.formUtilService.createTranslation(merchant,'ar', arFields );
      // if (arTranslation) {
      //   merchant.translation_data.push(arTranslation);
      // }
      if(merchant.translation_data.length <= 0)
        delete merchant.translation_data;
      // Dynamically remove properties that are undefined or null at the top level of city object
      Object.keys(merchant).forEach(key => {
        if (merchant[key] === undefined || merchant[key] === null) {
            delete merchant[key];  // Delete property if it's undefined or null
         }
      });

     delete merchant.merchantName;  
     delete merchant.f_name;
     delete merchant.l_name;
    //  delete merchant.merchantName_ar;    
    //  delete merchant.supervisorName;
    //  delete merchant.supervisorName_ar;
    // delete merchant.country_id;
 
     return merchant;
  }
 
     
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.merchantForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.merchantForm.controls).forEach(control => {
        this.merchantForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.merchantForm);
      return;
    }
    this.formError = null;
      const newData = this.merchantForm.value;
    
      if(this.storeLogoBase64){
        newData.companyLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
      
     
      delete newData.qrCode;
      delete newData.activationCode;

      this.merchant = this.createMerchantFromForm(newData);
      if(!this.isEditing)
        {  
          delete this.merchant.id;
          //this.merchant = newData;
          
          //Dispatch Action
          this.store.dispatch(addMerchantlist({ newData: this.merchant }));
        }
        else
        { 
          //delete this.merchant.password;
          //delete this.merchant.email;
          const updatedDta = this.formUtilService.detectChanges(this.merchantForm, this.originalMerchantData);
          if (Object.keys(updatedDta).length > 0) {
            this.merchant = this.createMerchantFromForm(updatedDta);
            this.merchant.id = this.globalId;
            this.store.dispatch(updateMerchantlist({ updatedData: this.merchant }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
        }
      
  }
  
  
    /**
 * Password Hide/Show
 */
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
    toggleConfirmFieldTextType() {
      this.confirmFieldTextType = !this.confirmFieldTextType;
    }
  

  
    onImageUpload(event: UploadEvent): void {
      if (event.type === 'image') {
        // Handle Merchant Picture Upload
        this.merchantPictureBase64 = event.file;
        this.fileName2 = ''; // Set the file name
        this.existantmerchantPicture = event.file;
        this.merchantForm.controls['image'].setValue(this.existantmerchantPicture);
      }
    }
    
    onLogoUpload(event: UploadEvent): void {
      if (event.type === 'logo') {
        // Handle Logo Upload
        this.storeLogoBase64 = event.file;
        this.fileName1 = ''; // Set the file name
        this.existantcompanyLogo = event.file;
        this.merchantForm.controls['companyLogo'].setValue(this.existantcompanyLogo);
      }
    }
    onToggle(event: any){

      if(event){
        const newValue = event.target.checked ? 'active' : 'inactive';
        this.merchantForm.get('status')?.setValue(newValue);
    
      }
    }
    
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
   
    this.merchantForm.reset();
    this.router.navigateByUrl('/private/merchants/list');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/merchants/list');
    
  }

}