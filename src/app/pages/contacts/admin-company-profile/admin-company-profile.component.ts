/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { fetchCountrylistData } from 'src/app/store/country/country.action';

import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { Country } from 'src/app/store/country/country.model';

import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { selectCompany, selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { _User } from 'src/app/store/Authentication/auth.models';
import { getCompanyProfile, updateCompanyProfile } from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-admin-company-profile',
  templateUrl: './admin-company-profile.component.html',
  styleUrl: './admin-company-profile.component.scss',
  //encapsulation: ViewEncapsulation.None  // Disable view encapsulation
})
export class AdminCompanyProfileComponent implements OnInit, OnDestroy{
 
  adminForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  breadCrumbItems: Array<object>;

  existantRegistrationFile: string = null;
  existantcompanyLogo: string = null
  loading$: Observable<boolean>;
  private readonly destroy$ = new Subject<void>();

  sectionlist:  any[] = [];
  
  filteredCountries: Country[] = [];
  // filteredAreas :  Area[] = [];
  // filteredCities:  City[] = [];
  originalCompanyData: any = {}; 

  @ViewChild('formElement', { static: false }) formElement: ElementRef;
  currentUser: _User = null;
  phoneCode: string = null;
  errorMessage: string = null;
  phoneUtil = PhoneNumberUtil.getInstance();
  countryCode: string = null;
  selectedCompany : any = null;
  constructor(
    private formBuilder: UntypedFormBuilder, 
    private authService: AuthenticationService, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {
      
      this.authService.currentUser$.subscribe(user =>{
        this.currentUser = user;
        
      });
     
     
      this.loading$ = this.store.pipe(select(selectDataLoading));
 
      this.store.dispatch(getCompanyProfile({companyId: this.currentUser.companyId}))
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
     
      this.initForm();
      
     }


 getCountryCodeFromPhoneNumber(phoneNumber: string): string {
  try {
    // Parse the phone number
    const number = this.phoneUtil.parse(phoneNumber);
    
    // Get the country code (without the leading '+')
    const countryCode = number.getCountryCode().toString();

    return countryCode;
  } catch (error) {
    console.error('Error parsing phone number:', error);
    return '';
  }
}
    
   private initForm() {
    this.adminForm = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    name_ar: [null],
    description: [null],
    description_ar: [null],
    companyEmail: [null],
    website: [null],
    VAT: [null],
    registrationCode: [null],
    registrationFile: [null],
    section_id:[null, Validators.required],
    companyLogo: [null],
    officeTel: [null],
    building_floor: [null],
    street: [null],
    city:[null],
    country_id:[null, Validators.required],
    
    bank: [null],
    IBAN: [null],
    SWIFT: [null],
    whatsup: [null] ,
    facebook:[null]  ,
    twitter:  [null],
    instagram: [null] ,
    Snapchat: [null] ,
    Tiktok:[null]  ,
    LinkedIn:[null] ,
    Pinterest:[null],
    youtube: [null]

    
  });} 

  fileName1: string = ''; 
  fileName: string = ''; 

  ngOnInit() {
    this.fetchCountry();
    this.fetchSection();
   
    this.store
          .pipe(select(selectCompany), takeUntil(this.destroy$))
          .subscribe(company => {
            if (company) {
              this.selectedCompany = company; 
              console.log(this.selectedCompany);
              if (this.selectedCompany?.user?.country?.phoneCode) {
                this.countryCode = this.selectedCompany.user.country.phoneCode;
                console.log('Country code set:', this.countryCode);
              }
              this.phoneCodeVsCountryValidity(this.selectedCompany);
              this.existantcompanyLogo = this.selectedCompany.companyLogo;
              this.patchValueForm(this.selectedCompany);
              this.originalCompanyData = _.cloneDeep(this.selectedCompany);
              
            }
          });
         

    }
    checkPhoneNumberMismatch(code1: string){
          
      if(code1 !== this.countryCode) {
        console.log(code1);
        console.log('********');
        console.log(this.countryCode);
       
        this.adminForm.get('officeTel').setErrors({ 'invalidPhone': true });
        this.errorMessage = 'You have to modify the phone number according to the country Selected';
      } 
      else
      {
       this.adminForm.get('officeTel').setErrors(null);
       this.errorMessage = null;
      }
    }
    phoneCodeVsCountryValidity(company: any){
      if(company?.user?.country){
        console.log(company.user.country);
       
        if(!company.officeTel)
           this.phoneCode = company.user.country.ISO2;
        else {
        console.log('the office tel is not empty',company?.user?.country?.phoneCode );
         const countryCode = this.getCountryCodeFromPhoneNumber(company?.officeTel);
         if (this.countryCode && countryCode) {
          this.checkPhoneNumberMismatch(countryCode);
        }
        // this.checkPhoneNumberMismatch(countryCode, this.countryCode);     
         
        }
       }
    }
    patchValueForm(company: any){
      this.adminForm.controls['country_id'].setValue(company.user?.country_id);
      this.adminForm.patchValue(company);
      this.adminForm.patchValue({
        name: company.translation_data[0]?.name,
        name_ar: company.translation_data[1]?.name,
        description: company.translation_data[0]?.description,
        description_ar: company.translation_data[1]?.description,
             
      });
    
    }
    fetchCountry(){
      this.store.select(selectDataCountry).subscribe((data) =>{
        this.filteredCountries = [...data].map(country =>{
          const translatedName = country.translation_data?.[0]?.name || 'No name available';
      
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
          const translatedName =  section.translation_data?.[0]?.name || 'No name available';
      
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
       
   
    setCountryByPhoneCode(code: string){
      const country = this.filteredCountries.find(c => c.phoneCode === code);
      this.adminForm.get('country_id').setValue(country?.id);
      this.adminForm.get('country_id').markAsDirty();

    }
  
   
  onPhoneNumberChanged(event: { number: string; countryCode: string }) {
    this.adminForm.get('officeTel').setValue(event.number);
    this.countryCode = event.countryCode;
    this.setCountryByPhoneCode(event.countryCode);
    this.checkPhoneNumberMismatch(event.countryCode);

  }
  onCountryChange(event: any){
    if(event){
      this.countryCode = event.phoneCode;
      console.log(event);
      if(this.adminForm.get('officeTel').value){
        const countryCode = this.getCountryCodeFromPhoneNumber(this.adminForm.get('officeTel').value);
        this.checkPhoneNumberMismatch(countryCode);
        
      }
      else
        this.phoneCode = event.ISO2;

    }
  }
 
  createProfileFromForm(formValue): any {
    const company = formValue;
    company.translation_data = [];
    const enFields = [
      { field: 'name', name: 'name' },
      { field: 'description', name: 'description' },


    ];
    const arFields = [
      { field: 'name_ar', name: 'name' },
      { field: 'description_ar', name: 'description' },


    ];
   // Create the English translation if valid
    const enTranslation = this.formUtilService.createTranslation(company,'en', enFields );
    if (enTranslation) {
      company.translation_data.push(enTranslation);
    }
   
    // Create the Arabic translation if valid
    const arTranslation = this.formUtilService.createTranslation(company,'ar', arFields );
    if (arTranslation) {
      company.translation_data.push(arTranslation);
    }
    if(company.translation_data.length <= 0)
      delete company.translation_data;
    // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(company).forEach(key => {
      if (company[key] === undefined || company[key] === null) {
          delete company[key];  // Delete property if it's undefined or null
       }
    });

   delete company.name;  
   delete company.name_ar; 
   delete company.description;  
   delete company.description_ar;  
  
  

   return company;
}

  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.adminForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.adminForm.controls).forEach(control => {
        this.adminForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.adminForm);
      return;
    }
      this.formError = null;
      const newData = this.adminForm.value;
      if(this.existantcompanyLogo){
        newData.companyLogo = this.existantcompanyLogo;
      }
          
      const updatedDta = this.formUtilService.detectChanges(this.adminForm, this.originalCompanyData);

      if (Object.keys(updatedDta).length > 0) {
        const changedData = this.createProfileFromForm(updatedDta);
        
        if(this.existantcompanyLogo !== this.originalCompanyData.companyLogo)
          changedData.companyLogo = this.existantcompanyLogo;
        
        changedData.id = newData.id;
        this.store.dispatch(updateCompanyProfile({ company: changedData }));
      }
      else
      {
        this.formError = 'Nothing has been changed!!!';
        this.formUtilService.scrollToTopOfForm(this.formElement);
      }
        
      
    
  }
  onLogoUpload(event: UploadEvent): void {
    if (event.type === 'logo') {
      // Handle Logo Upload
      this.fileName = ''; // Set the file name
      this.existantcompanyLogo = event.file;
      this.adminForm.controls['companyLogo'].setValue(this.existantcompanyLogo);
    }
  }  

  
  uploadFileRegistration(event: UploadEvent): void {
    if (event.type === 'logo') {
      // Handle Logo Upload
      this.fileName1 = ''; // Set the file name
      this.existantRegistrationFile = event.file;
      this.adminForm.controls['registrationFile'].setValue(this.existantRegistrationFile);
    }
  }
  onCancel(){

    this.adminForm.reset();
    this.router.navigateByUrl('/private/dashboard');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}