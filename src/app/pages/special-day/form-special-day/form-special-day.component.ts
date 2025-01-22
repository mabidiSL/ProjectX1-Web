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
import { _User } from 'src/app/store/Authentication/auth.models';

import { selectedSpecialDay,  selectDataLoadingSpecial } from 'src/app/store/specialDay/special-selector';
import { addSpecialDaylist, getSpecialDayById, updateSpecialDaylist } from 'src/app/store/specialDay/special.action';
import { SpecialDay } from 'src/app/store/specialDay/special.model';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';

import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { Country } from 'src/app/store/country/country.model';
import { selectDataCountry } from 'src/app/store/country/country-selector';

@Component({
  selector: 'app-form-special-day',
 
  templateUrl: './form-special-day.component.html',
  styleUrl: './form-special-day.component.scss'
})
export class FormSpecialDayComponent implements OnInit, OnDestroy{
  @Input() type: string;

  merchantList$: Observable<Merchant[]>;
  countryList$: Observable<Country[]>;

  loading$: Observable<boolean>;

  merchantList: Merchant[]= [];
  filteredCountries: Country[]= [];

  

  countryId: number =  null;
  companyId: number =  null;
  currentRole: string = '';
  bsConfig: Partial<BsDatepickerConfig>;


  public currentUser: Observable<_User>;

  dropdownSettings : any;
  formSpecialDay: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  private readonly destroy$ = new Subject<void>();
  specialLogoBase64: string = null;
  isEditing = false;
  isLoading = false;
  originalSpecialDayData: SpecialDay = {};
  @ViewChild('formElement', { static: false }) formElement: ElementRef;




  constructor(
    private readonly store: Store, 
    private readonly formBuilder: UntypedFormBuilder, 
    private readonly router: Router,
    private readonly datepickerConfigService: DatepickerConfigService,
    private readonly authservice: AuthenticationService,
    private readonly formUtilService: FormUtilService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute){
      
      this.authservice.currentUser$.subscribe(user => {
        this.currentRole = user?.role.translation_data[0].name;
        this.companyId =  user?.companyId;
        this.countryId = user?.country_id;
        
      } );
      this.loading$ = this.store.pipe(select(selectDataLoadingSpecial)); 
      this.merchantList$ = this.store.pipe(select(selectDataMerchant)); // Observing the merchant list from store
      this.countryList$ = this.store.pipe(select(selectDataCountry)); // Observing the country list from store
      this.initForm();
      this.bsConfig = this.datepickerConfigService.getConfig();
      this.setReadonlyConfig();

       
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
      if (startDate > endDate) {
        return { dateMismatch: true }; // Start date must be before end date
      }
    }
    return null; // Valid
  }

  private initForm() {
    this.formSpecialDay = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      company_id: [null],
      countries: [null],
      startDate: [null, Validators.required],
      endDate: [null],
      recursAnnually: [true],
      applyToAllCountries: [true],
      internalSpecialDay: [true]
    

    });
  }
 
  ngOnInit() {
    //this.fetchMerchants(null);
    this.fetchCountries();
   
     
    const specialId = this.route.snapshot.params['id'];
    if (specialId) {
      if (this.type === 'view') {
        this.formUtilService.disableFormControls(this.formSpecialDay);
       }
      
      // Dispatch action to retrieve the special by ID
      this.store.dispatch(getSpecialDayById({ SpecialDayId:  specialId}));
      // Subscribe to the selected special from the store
      this.store
        .pipe(select(selectedSpecialDay), takeUntil(this.destroy$))
        .subscribe(special => {
          if (special) {
            special.startDate = new Date(special.startDate);
            //special.endDate = new Date(special.endDate);
            this.patchValueForm(special);
            this.originalSpecialDayData = { ...special };
            this.isEditing = true;

          }
        });
    }
  
}
onDateChange(event: any){
  console.log('i am on date change');
  
  const startDate = new Date(event);
  startDate.setHours(0, 0, 0, 0);
  this.formSpecialDay.get('startDate').setValue(startDate);
  const endDate = new Date(event);
  endDate.setHours(23, 59, 59, 999);
  this.formSpecialDay.get('endDate').setValue(endDate);
}
onChangeCountrySelection(event: Country){
  const country = event;
  //this.merchantList = [];
  this.formSpecialDay.get('company_id').setValue(null);
  
  if(country){
      this.fetchMerchants(country.id);
    }
}
fetchCountries(){
  this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 100 ,query:'', status: 'active'})); 
  this.countryList$.subscribe(data => {
    this.filteredCountries = [...data].map(country =>{
      const translatedName =  country.translation_data?.[0]?.name || 'No name available';
      return {
        ...country,  
        translatedName 
      };}).sort((a, b) => {
        // Sort by translatedName
        return a.translatedName.localeCompare(b.translatedName);
      });
    });
}
fetchMerchants(country_id: number){
 this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 100 ,query:'', country_id: country_id, status: 'active'})); 
 this.merchantList$.subscribe(data => { 
  this.merchantList = [...data].map(merchant =>{
  const translatedName =  merchant.translation_data?.[0]?.name || 'No name available';
  return {
    ...merchant,  
    translatedName 
  };}).sort((a, b) => {
    // Sort by translatedName
    return a.translatedName.localeCompare(b.translatedName);
  });
 });
}

patchValueForm(special: SpecialDay){
   const companyId = special.company_id;
  this.formSpecialDay.patchValue(special);
  if(companyId === 1){
      if(special?.countries && special?.countries.length === 1){
        if(special?.countries[0].id === this.countryId){
          this.formSpecialDay.get('internalSpecialDay').setValue(true);
        }else{
          this.formSpecialDay.get('internalSpecialDay').setValue(false);
          this.formSpecialDay.get('applyToAllCountries').setValue(false);
          this.formSpecialDay.get('countries').setValue(special?.countries.map(country => country.id));

        }
      }
      else if (special?.countries && special?.countries.length === 240){
        this.formSpecialDay.get('internalSpecialDay').setValue(false);
        this.formSpecialDay.get('applyToAllCountries').setValue(true);
      }
      else if(special?.countries && special?.countries.length > 1 && special?.countries.length < 240){
        this.formSpecialDay.get('internalSpecialDay').setValue(false);
        this.formSpecialDay.get('applyToAllCountries').setValue(false);
        this.formSpecialDay.get('countries').setValue(special?.countries.map(country => country.id));
      }
    }
    else
    {
      this.formSpecialDay.get('company_id').setValue(special.company_id);
      this.formSpecialDay.get('countries').setValue(special.countries);

    }
  this.formSpecialDay.patchValue({
    name: special.translation_data[0].name,
    description: special.translation_data[0].description,
  });

}


getMerchantName(MerchantId: any){
    return this.merchantList.find(merchant => merchant.id === MerchantId)?.translation_data[0].name ;
  }



createSpecialDayFromForm(formValue): SpecialDay{
  const special = formValue;
  special.translation_data= [];
  const enFields = [
    { field: 'name', name: 'name' },
    { field: 'description', name: 'description' },

  ];
  // const arFields = [
  //   { field: 'name_ar', name: 'name' },
  //   { field: 'description_ar', name: 'description' },
  //   { field: 'termsAndConditions_ar', name: 'termsAndConditions' },


  // ];
  
  // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(special,'en', enFields);
  if (enTranslation) {
    special.translation_data.push(enTranslation);
  }

  // Create the Arabic translation if valid
  // const arTranslation = this.formUtilService.createTranslation(special,'ar', arFields);
  // if (arTranslation) {
  //   special.translation_data.push(arTranslation);
  // }
  if(special.translation_data.length <= 0)
    delete special.translation_data;

  // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(special).forEach(key => {
      if (special[key] === undefined || special[key] === null || special[key]==='') {
        delete special[key];  // Delete property if it's undefined or null
      }
    });

  console.log(special);
  if(this.companyId === 1){
    special.company_id = this.companyId;

      if (special?.internalSpecialDay){
        special.countries = [this.countryId];
      }
      else if(special?.applyToAllCountries)
      {
        special.countries = [];
        
      }
      else{
        console.log(special.countries);
        
      }
    }
  else
  {
    special.countries = [this.countryId];
    special.company_id = this.companyId;
  }
    delete special.name;  
    delete special.description;
    delete special.internalSpecialDay;
    delete special.applyToAllCountries;

    return special;
 
}

  onSubmit(){

    this.formSubmitted = true;

    if (this.formSpecialDay.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.formSpecialDay.controls).forEach(control => {
        this.formSpecialDay.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.formSpecialDay);
      return;
    }
      this.formError = null;
      let newData = this.formSpecialDay.value;
      
      if(!this.isEditing)
      {
         delete newData.id;
         newData = this.createSpecialDayFromForm(newData);
         console.log(newData);
         
         this.store.dispatch(addSpecialDaylist({ newData }));
      }
      else
      {
        const updatedDta = this.formUtilService.detectChanges(this.formSpecialDay, this.originalSpecialDayData);
        if (Object.keys(updatedDta).length > 0) {
          const changedData = this.createSpecialDayFromForm(updatedDta);
          changedData.id =  this.formSpecialDay.value.id;
          
          this.store.dispatch(updateSpecialDaylist({ updatedData: changedData }));
        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
      
   
    }



  onCancel(){
    this.formSpecialDay.reset();
    this.router.navigateByUrl('/private/special-days/list');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  toggleViewMode(){
   
    this.router.navigateByUrl('/private/special-days/list');

  }
  onChangeEventEmit(event: any){
    console.log(event);

  }
}