/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, filter, map, switchMap } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectStoreById } from 'src/app/store/store/store-selector';
import { addStorelist, getStoreById, updateStorelist } from 'src/app/store/store/store.action';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { Area } from 'src/app/store/area/area.model';
import { City } from 'src/app/store/City/city.model';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { Country } from 'src/app/store/country/country.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { Branch } from 'src/app/store/store/store.model';


@Component({
  selector: 'app-form-store',
  templateUrl: './form-store.component.html',
  styleUrl: './form-store.component.css'
})
export class FormStoreComponent implements OnInit, OnDestroy {
  
  @Input() type: string;
  storeForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  
  private destroy$ = new Subject<void>();
  
  public currentUser: Observable<_User>;

  merchantlist$: Observable<Merchant[]>;
  countrylist$: Observable<Country[]>;
  arealist$: Observable<Area[]>;
  citylist$: Observable<City[]>;
  loading$: Observable<boolean>;

  merchantList: Merchant[] = [];

  merchantId: number =  null;
  filteredAreas : Area[];
  filteredCities: City[];
  currentRole: string = '';
  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  fromPendingContext: boolean = false;

  imageURL: string | undefined;
  existantStoreLogo: string = null;
  existantStorePicture: string = null
  StorePictureBase64: string = null;
  storeLogoBase64: string = null;
  isEditing: boolean = false;
  uploadedFiles: any[] = [];
  originalStoreData: Branch = {}; 
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  // file upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false
  };
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {

      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading));

      this.currentRole = this.getCurrentUser()?.role.translation_data[0].name;
      this.merchantId =  this.getCurrentUser()?.merchantId;

      this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 100 , status: 'active'}));
      this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 100 , status: 'active'}));
      this.store.dispatch(fetchArealistData({ page: 1, itemsPerPage: 1000 , status: 'active'}));
      this.store.dispatch(fetchCitylistData({ page: 1, itemsPerPage: 10000 , status: 'active'}));
      
      this.initForm();

      
     }
 
   
  private initForm() {
    this.storeForm = this.formBuilder.group({
      
      id: [null],
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
      phone: ['', Validators.required ],
      url:[''],
      merchant_id: [null, Validators.required],
      city_id:[null, Validators.required],
      area_id:[null,  Validators.required], 
      images:[null],
       
    });
  }
  private getCurrentUser(): _User {
    // Replace with your actual logic to retrieve the user role
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
}
  ngOnInit() {
    
      this.merchantlist$ = this.store.select(selectDataMerchant);
      this.merchantlist$.subscribe((data) => { 
        this.merchantList =  [...data].map(merchant =>{
          const translatedName = merchant.translation_data && merchant.translation_data[0]?.name || 'No name available';
      
          return {
            ...merchant,  
            translatedName 
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
      });
      this.countrylist$ = this.store.select(selectDataCountry);
      this.arealist$ = this.store.select(selectDataArea);
      this.arealist$.subscribe((data) => { 
        this.filteredAreas =  [...data].map(area =>{
          const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
      
          return {
            ...area,  
            translatedName 
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
      });
      this.citylist$ = this.store.select(selectDataCity);
      this.citylist$.subscribe((data) => {
        this.filteredCities = [...data].map(city =>{
         const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
     
         return {
           ...city,  
           translatedName 
         };
       }).sort((a, b) => {
         // Sort by translatedName
         return a.translatedName.localeCompare(b.translatedName);
       });
     });
   
    // Append the value of the Merchant to merchant_id
    if(this.currentRole !== 'Admin'){
     
      this.storeForm.get('merchant_id').setValue(this.merchantId);
      
      this.merchantlist$.pipe(
        filter(merchant => !!merchant), // Only continue if merchant is not null
        switchMap(merchant => {
            const selectMerchant = merchant.find(m => m.id === this.merchantId);
    
            if (selectMerchant) {
                const merchant_country_id = selectMerchant.user.city.area.country.id;
    
                return this.arealist$.pipe(
                    map(areas => {
                        this.filteredAreas = areas.filter(a => a.country_id === merchant_country_id);
                        console.log(this.filteredAreas);
                    })
                );
            } else {
                this.filteredAreas = [];
                return EMPTY; // Return an empty observable
            }
        })
    ).subscribe();
  }

    const StoreId = this.route.snapshot.params['id'];
    console.log('Store ID from snapshot:', StoreId);
    if (StoreId) {
      // Dispatch action to retrieve the Store by ID
      this.store.dispatch(getStoreById({ StoreId }));
      
      // Subscribe to the selected Store from the store
      this.store
        .pipe(select(selectStoreById), takeUntil(this.destroy$))
        .subscribe(Store => {
          if (Store) {
            console.log('Retrieved Store:', Store);
            this.uploadedFiles = Store.images;
            console.log(this.uploadedFiles);
            const areaId = Store.city.area_id;
            this.arealist$.subscribe(
              areas=> 
                this.filteredAreas = areas.filter(a =>a.country_id == Store.city.area.country.id )
            );
            if(this.filteredAreas){
              this.citylist$.subscribe(
                cities => 
                  this.filteredCities = cities.filter(c =>c.area_id == areaId )
              );
           }
            this.storeForm.get('area_id').setValue(areaId); 
            this.storeForm.get('city_id').setValue(Store.city_id); 

            console.log(this.uploadedFiles);
            this.patchValueForm(Store);
            this.originalStoreData = { ...Store };

            this.isEditing = true;

          }
        });
    }
   
}
patchValueForm(store: Branch){
  this.storeForm.patchValue(store);
  this.storeForm.patchValue({
    name: store.translation_data[0].name,
    name_ar: store.translation_data[1].name,
    description: store.translation_data[0].description,
    description_ar: store.translation_data[1].description,
    
  });

}
private getNavigationState(){
  /**Determining the context of the routing if it is from Approved State or Pending State */
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.fromPendingContext = navigation.extras.state.fromPending ;
    }
}
  getMerchantName(MerchantId: number){
    const value = this.merchantList.find(merchant => merchant.id === MerchantId)?.translation_data[0].name ;
    return value;
  }
  getAreaName(id: number){
    return this.filteredAreas.find(area => area.id === id)?.translation_data[0].name ;
  }
  getCityName(id: number){
    return this.filteredCities.find(city => city.id === id)?.translation_data[0].name ;
  }
  
  onPhoneNumberChanged(phoneNumber: string) {
    console.log('PHONE NUMBER', phoneNumber);
    this.storeForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.storeForm.get('supervisorPhone').setValue(phoneNumber);
  }
  onChangeMerchantSelection(event: any){
    const selectedMerchantId = event.target.value;
    let selectMerchant =  null;
    this.merchantlist$.subscribe(merchant=>
      selectMerchant = merchant.find(m => m.id == selectedMerchantId)
    );
    if(selectMerchant){
    
      const merchant_country_id = selectMerchant.user.city.area.country.id;
      //this.storeForm.get('country_id').setValue(merchant.city);
      this.arealist$.subscribe(
        areas=> 
          this.filteredAreas = areas.filter(a =>a.country_id == merchant_country_id )
      );
    }
    else{
      this.filteredAreas = [];
    }
    
  }
  onChangeAreaSelection(event: any){
    const area = event.target.value;
    console.log(area);
    if(area){
      this.citylist$.subscribe(
        cities => 
          this.filteredCities = cities.filter(c =>c.area_id == area )
      );
    }
    else{
      this.filteredCities = [];
    }
    
  }
  // convenience getter for easy access to form fields
  get f() { return this.storeForm.controls; }

 parseImages(images: any[]){
    const returnedImages: any[] = [];

      images.forEach((image) =>{
        if(image.dataURL){
          returnedImages.push(image.dataURL);
        }
        else if (image.id){
          returnedImages.push(image.id);

        }
      });
      return returnedImages;
  }
  createStoreFromForm(formValue): Branch {
    const branch = formValue;
    branch.translation_data = [
      {
        name: formValue.name? formValue.name: null, 
        description: formValue.description? formValue.description: null,   
        language: 'en',        
      },
      {
        name: formValue.name_ar? formValue.name_ar: null ,  
        description: formValue.description_ar? formValue.description_ar: null ,   
        language:'ar',              
      }
    ];
    branch.translation_data = branch.translation_data.map(translation => {
    // Iterate over each property of the translation and delete empty values
    Object.keys(translation).forEach(key => {
     if (translation[key] === '' || translation[key] === null || translation[key] === undefined) {
              delete translation[key];  // Remove empty fields
            }
          });
          return translation; // Return the modified translation object
    });
          // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(branch).forEach(key => {
      if (branch[key] === undefined || branch[key] === null) {
          delete branch[key];  // Delete property if it's undefined or null
       }
    });
        
   return branch;
}
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.storeForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.storeForm.controls).forEach(control => {
        this.storeForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.storeForm);
      return;
    }
    this.formError = null;
          
      let newData = this.storeForm.value;
      delete newData.area_id;

          if(!this.isEditing)
            {           
              if(this.uploadedFiles){
                const images: any[] = [];
                this.uploadedFiles.forEach(file => {
                  images.push(file.dataURL); // Push each Base64 string into the images array
              });
              newData.images =  images;
              }
              delete newData.id;
              newData = this.createStoreFromForm(newData);
              //Dispatch Action
              this.store.dispatch(addStorelist({ newData }));
        }
        else
        {
          const updatedDta = this.formUtilService.detectChanges(this.storeForm, this.originalStoreData);
          if (Object.keys(updatedDta).length > 0) {
            const changedData = this.createStoreFromForm(updatedDta);
            changedData.images = this.parseImages(this.uploadedFiles);
            this.store.dispatch(updateStorelist({ updatedData: changedData }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
          
        }
    
  }
  
  
  /**
   * File Upload Image
   */
 
  
  async fileChange(event: any): Promise<string> {
    const fileList: any = (event.target as HTMLInputElement);
    const file: File = fileList.files[0];
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
  
  
 
onUploadSuccess(event: any) {
  setTimeout(() => {
   
    this.uploadedFiles.push(event[0]);
    
  }, 100);
}

// File Remove
removeFile(event: any) {
  this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
}


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){

    this.storeForm.reset();
    this.router.navigateByUrl('/private/stores');
  }
 
  toggleViewMode(){
    
    if(this.fromPendingContext)
      this.router.navigateByUrl('/private/stores/approve');
    else
      this.router.navigateByUrl('/private/stores');

  }
}