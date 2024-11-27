/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { selectDataLoading } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { Country } from 'src/app/store/country/country.model';
import { Area } from 'src/app/store/area/area.model';
import { City } from 'src/app/store/City/city.model';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { selectLoggedUser } from 'src/app/store/Authentication/authentication-selector';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { _User } from 'src/app/store/Authentication/auth.models';
import { updateProfile } from 'src/app/store/Authentication/authentication.actions';
@Component({
  selector: 'app-admin-company-profile',
  templateUrl: './admin-company-profile.component.html',
  styleUrl: './admin-company-profile.component.scss'
})
export class AdminCompanyProfileComponent implements OnInit{
 
  @Input() type: string;
  adminForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  private destroy$ = new Subject<void>();
  breadCrumbItems: Array<object>;

  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  existantmerchantLogo: string = null;
  existantmerchantPicture: string = null
  merchantPictureBase64: string = null;
  LogoBase64: string = null;
  isEditing: boolean = false;
  fromPendingContext: boolean = false;

  countrylist: Country[] = [];
  countrylist$: Observable<Country[]>  ;
  arealist$:  Observable<Area[]>  ;
  currentMerchant :  Merchant  ;

  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>;

  sectionlist:  any[] = [];
  
  filteredCountries: Country[] = [];
  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  serviceTypes: string[] = ['company', 'entreprise'];
  originalMerchantData: Merchant = {}; 
  @ViewChild('formElement', { static: false }) formElement: ElementRef;
  currentUser: _User = null;
  existantImage: string = null;

 
  constructor(
    private formBuilder: UntypedFormBuilder, 
    private authService: AuthenticationService, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {

      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 1000, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10000, status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
     
      this.initForm();
      
     }
    
   private initForm() {
    this.adminForm = this.formBuilder.group({
    id: [null],
    name: ['', Validators.required],
    name_ar: ['', Validators.required],
    image:[''],
    phone: [''],
    country_id:[null,Validators.required],
    city_id:[null,Validators.required],
    area_id:[null,Validators.required], 
    bankAccountNumber: [''],
    
  });} 
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 
  globalId : number = null;

  ngOnInit() {
    this.fetchCountry();
    this.fetchAreas();
    this.fetchCities();
    this.fetchSection();

    this.store.select(selectLoggedUser).subscribe(
      user => {
        if (user) {
          this.currentUser = user;
               
        }
        else
        {
          this.currentUser = this.authService.currentUserValue;
        }
      
    });

          this.adminForm.controls['country_id'].setValue(this.currentUser.city.area.country_id);
          this.adminForm.controls['area_id'].setValue(this.currentUser.city.area_id);
          this.adminForm.controls['city_id'].setValue(this.currentUser.city_id);
          this.existantImage = this.currentUser.image;
          this.patchValueForm(this.currentUser);
          this.originalMerchantData = _.cloneDeep(this.currentUser);
          this.isEditing = true;

    }
   
    patchValueForm(user: _User){
      this.adminForm.patchValue(user);
      this.adminForm.patchValue({
        f_name: user.translation_data[0].f_name,
        f_name_ar: user.translation_data[1].f_name,
        
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
    fetchAreas(){
      this.store.select(selectDataArea).subscribe(data =>
        this.filteredAreas =  [...data].map(area =>{
        const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
        return {
          ...area,  
          translatedName 
        };
      })
      .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
      }));
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

    onChangeCountrySelection(event: Country){
      const country = event;
      this.adminForm.get('area_id').setValue(null);
      this.adminForm.get('city_id').setValue(null);
      this.filteredAreas = [];
      this.filteredCities = [];
  
      if(country){
        this.store.select(selectDataArea).subscribe(data =>
          this.filteredAreas =  [...data].map(area =>{
          const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
          return {
            ...area,  
            translatedName 
          };
        })
        .filter(area => area.country_id === country.id)
        .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
        }));
      }
     
      
    }
    onChangeAreaSelection(event: Area){
      const area = event;
      this.filteredCities = [];
      this.adminForm.get('city_id').setValue(null);
  
      if(area){
        this.store.select(selectDataCity).subscribe((data) => {
          this.filteredCities = [...data].map(city =>{
           const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
       
           return {
             ...city,  
             translatedName 
           };
         })
         .filter(city => city.area_id === area.id)
         .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
         });
       });
      }
        
    }
  
  onPhoneNumberChanged(phoneNumber: string) {
    this.adminForm.get('phone').setValue(phoneNumber);
  }

  createUserFromForm(formValue): Merchant {
    const user = formValue;
    user.translation_data = [];
    const enFields = [
      { field: 'f_name', name: 'f_name' },
    ];
    const arFields = [
      { field: 'f_name_ar', name: 'f_name' },
    ];
   // Create the English translation if valid
    const enTranslation = this.formUtilService.createTranslation(user,'en', enFields );
    if (enTranslation) {
      user.translation_data.push(enTranslation);
    }
   
    // Create the Arabic translation if valid
    const arTranslation = this.formUtilService.createTranslation(user,'ar', arFields );
    if (arTranslation) {
      user.translation_data.push(arTranslation);
    }
    if(user.translation_data.length <= 0)
      delete user.translation_data;
    // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(user).forEach(key => {
      if (user[key] === undefined || user[key] === null) {
          delete user[key];  // Delete property if it's undefined or null
       }
    });

   delete user.f_name;  
   delete user.f_name_ar;    
   delete user.area_id;
   delete user.country_id;

   return user;
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
      if(this.existantImage){
        newData.image = this.existantImage;
      }
          
      const updatedDta = this.formUtilService.detectChanges(this.adminForm, this.originalMerchantData);
      if (Object.keys(updatedDta).length > 0) {
        const changedData = this.createUserFromForm(updatedDta);
        changedData.id = newData.id;
        this.store.dispatch(updateProfile({ user: changedData }));
      }
      else{
        this.formError = 'Nothing has been changed!!!';
        this.formUtilService.scrollToTopOfForm(this.formElement);
      }
        
      
    
  }
     
  onImageUpload(event: UploadEvent): void {
    if (event.type === 'image') {
      this.fileName2 = ''; // Set the file name
      this.existantImage = event.file;
      this.adminForm.controls['merchantPicture'].setValue(this.existantImage);
    }
  }
  
  onLogoUpload(event: UploadEvent): void {
    if (event.type === 'logo') {
      // Handle Logo Upload
      this.LogoBase64 = event.file;
      this.fileName1 = ''; // Set the file name
      this.existantmerchantLogo = event.file;
      this.adminForm.controls['merchantLogo'].setValue(this.existantmerchantLogo);
    }
  }
  onCancel(){

    this.adminForm.reset();
    this.router.navigateByUrl('/private/dashboard');
  }
  
}