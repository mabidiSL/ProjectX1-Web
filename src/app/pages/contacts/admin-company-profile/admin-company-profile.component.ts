/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
// import { fetchArealistData } from 'src/app/store/area/area.action';
// import { fetchCitylistData } from 'src/app/store/City/city.action';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
//import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
//import { selectDataCity } from 'src/app/store/City/city-selector';
import { Country } from 'src/app/store/country/country.model';
// import { Area } from 'src/app/store/area/area.model';
// import { City } from 'src/app/store/City/city.model';
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
export class AdminCompanyProfileComponent implements OnInit{
 
  adminForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  breadCrumbItems: Array<object>;

  existantRegistrationFile: string = null;
  existantcompanyLogo: string = null
  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  sectionlist:  any[] = [];
  
  filteredCountries: Country[] = [];
  // filteredAreas :  Area[] = [];
  // filteredCities:  City[] = [];
  originalCompanyData: any = {}; 

  @ViewChild('formElement', { static: false }) formElement: ElementRef;
  currentUser: _User = null;

 
  constructor(
    private formBuilder: UntypedFormBuilder, 
    private authService: AuthenticationService, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {
      
      this.authService.currentUser$.subscribe(user =>{
        this.currentUser = user;
      });
      console.log(this.currentUser);
     
     
      console.log('***********');
      this.loading$ = this.store.pipe(select(selectDataLoading));
      console.log('***********');
 
      this.store.dispatch(getCompanyProfile({companyId: this.currentUser.companyId}))
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
     
      this.initForm();
      
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
    // this.fetchAreas();
    // this.fetchCities();
    this.fetchSection();
   
    this.store
          .pipe(select(selectCompany), takeUntil(this.destroy$))
          .subscribe(company => {
            if (company) {
              console.log(company);
              
              this.existantcompanyLogo = company.companyLogo;
              this.patchValueForm(company);
              this.originalCompanyData = _.cloneDeep(company);
              }
          });
         

    }
   
    patchValueForm(company: any){
      this.adminForm.controls['country_id'].setValue(company.user?.country_id);
      this.adminForm.patchValue(company);
      //this.adminForm.controls['country_id'].setValue(company.user.country_id);
      // this.adminForm.controls['area_id'].setValue(company.user.city.area_id);
      // this.adminForm.controls['city_id'].setValue(company.user.city_id);
      this.adminForm.patchValue({
        name: company.translation_data[0].name,
        name_ar: company.translation_data[1]?.name,
        description: company.translation_data[0].description,
        description_ar: company.translation_data[1]?.description,
      

        
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
    // fetchAreas(){
    //   this.store.select(selectDataArea).subscribe(data =>
    //     this.filteredAreas =  [...data].map(area =>{
    //     const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
    //     return {
    //       ...area,  
    //       translatedName 
    //     };
    //   })
    //   .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
    //   }));
    // }
    // fetchCities(){
    //   this.store.select(selectDataCity).subscribe((data) => {
    //     this.filteredCities = [...data].map(city =>{
    //      const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
     
    //      return {
    //        ...city,  
    //        translatedName 
    //      };
    //    })
    //    .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
    //    });
    //  });
    // }

    // onChangeCountrySelection(event: Country){
    //   const country = event;
    //   this.adminForm.get('area_id').setValue(null);
    //   this.adminForm.get('city_id').setValue(null);
    //   this.filteredAreas = [];
    //   this.filteredCities = [];
  
    //   if(country){
    //     this.store.select(selectDataArea).subscribe(data =>
    //       this.filteredAreas =  [...data].map(area =>{
    //       const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
    //       return {
    //         ...area,  
    //         translatedName 
    //       };
    //     })
    //     .filter(area => area.country_id === country.id)
    //     .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
    //     }));
    //   }
     
      
    // }
    // onChangeAreaSelection(event: Area){
    //   const area = event;
    //   this.filteredCities = [];
    //   this.adminForm.get('city_id').setValue(null);
  
    //   if(area){
    //     this.store.select(selectDataCity).subscribe((data) => {
    //       this.filteredCities = [...data].map(city =>{
    //        const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
       
    //        return {
    //          ...city,  
    //          translatedName 
    //        };
    //      })
    //      .filter(city => city.area_id === area.id)
    //      .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
    //      });
    //    });
    //   }
        
    // }
    setCountryByPhoneCode(code: string){
      const country = this.filteredCountries.find(c => c.phoneCode === code);
      console.log(country);
      this.adminForm.get('country_id').setValue(country?.id);
    }
  
   
  onPhoneNumberChanged(event: { number: string; countryCode: string }) {
    this.adminForm.get('officeTel').setValue(event.number);
    this.setCountryByPhoneCode(event.countryCode);

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
  
   //delete company.area_id;
  // delete company.country_id;

   return company;
}

  /**
   * On submit form
   */
  onSubmit() {
    console.log('on submit');
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
      //console.log(newData);
      if(this.existantcompanyLogo){
        newData.companyLogo = this.existantcompanyLogo;
      }
          
      const updatedDta = this.formUtilService.detectChanges(this.adminForm, this.originalCompanyData);
      console.log(updatedDta);

      if (Object.keys(updatedDta).length > 0) {
        const changedData = this.createProfileFromForm(updatedDta);
        console.log(changedData);
        
        if(this.existantcompanyLogo !== this.originalCompanyData.companyLogo)
          changedData.companyLogo = this.existantcompanyLogo;
        
        changedData.id = newData.id;
        console.log(changedData);
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
  
}