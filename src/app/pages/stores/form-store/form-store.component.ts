/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY,  map } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectStoreById } from 'src/app/store/store/store-selector';
import { addStorelist, getStoreById, updateStorelist } from 'src/app/store/store/store.action';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { City } from 'src/app/store/City/city.model';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { Branch } from 'src/app/store/store/store.model';
import * as _ from 'lodash';
import { AuthenticationService } from 'src/app/core/services/auth.service';


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
  citylist$: Observable<City[]>;
  loading$: Observable<boolean>;

  merchantList: Merchant[] = [];

  merchantId: number =  null;
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
    private authservice: AuthenticationService,
    private formUtilService: FormUtilService,
    public store: Store) {

      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading));
      
      this.authservice.currentUser$.subscribe(user => {
        this.currentRole = user?.role.translation_data[0].name;
        this.merchantId =  user?.companyId;
        console.log(this.currentRole, 'and', this.merchantId);
        
      } );
      

      this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 100 , status: 'active'}));
      this.store.dispatch(fetchCitylistData({ page: 1, itemsPerPage: 10000 , status: 'active'}));
      
      this.initForm();

      
     }
 
   
  private initForm() {
    this.storeForm = this.formBuilder.group({
      
      id: [null],
      name: ['', Validators.required],
      name_ar: [''],
      description: ['', Validators.required],
      description_ar: [''],
      phone: ['', Validators.required ],
      company_id: [null, Validators.required],
      city_id:[null, Validators.required],
      images:[null],
      status:['active']
       
    });
  }
 
  ngOnInit() {
    
      this.fetchMerchants();
      this.fetchCities();
     
   
    // Append the value of the Merchant to company_id
    if(this.currentRole !== 'Admin'){
     
      this.storeForm.get('company_id').setValue(this.merchantId);
      this.storeForm.get('company_id').clearValidators();

      
      this.store.select(selectDataMerchant).subscribe(data=>{
        
        console.log(data);
        const selectMerchant = data.find(m => m.id === this.merchantId);
            
            if (selectMerchant) {
                const merchant_country_id = selectMerchant.user.country.id;
                return this.store.select(selectDataCity).pipe(
                    map(cities => {
                          this.filteredCities =  [...cities].map(city =>{
                          const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
                          return {
                            ...city,  
                            translatedName 
                          };
                        }).filter(city => city.country_id === merchant_country_id)
                        .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
                        })
                 
                    })
                );
            } else {
                this.filteredCities = [];
                return EMPTY; // Return an empty observable
            }
        
      });
  }

    const StoreId = this.route.snapshot.params['id'];
    if (StoreId) {
      // Dispatch action to retrieve the Store by ID
      this.store.dispatch(getStoreById({ StoreId }));
      
      // Subscribe to the selected Store from the store
      this.store
        .pipe(select(selectStoreById), takeUntil(this.destroy$))
        .subscribe(Store => {
          if (Store) {
            this.uploadedFiles = Store.images;
         
            // this.storeForm.get('city_id').setValue(Store.city_id); 
            // this.storeForm.get('images').setValue(Store.images); 
            // this.storeForm.get('phone').setValue(Store.phone);
            // this.storeForm.get('status').setValue(Store.status);
            this.patchValueForm(Store);
            this.originalStoreData = _.cloneDeep(Store);

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
   
  onPhoneNumberChanged(phoneNumber: string) {
    this.storeForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.storeForm.get('supervisorPhone').setValue(phoneNumber);
  }
  fetchMerchants(){
    this.store.select(selectDataMerchant).subscribe((data) => { 
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
  onChangeMerchantSelection(event: Merchant){
    const selectMerchant = event;
       
    if(selectMerchant){
      this.filteredCities = [];
      this.storeForm.get('city_id').setValue(null);
      const country_id = selectMerchant.user.country_id;
      
      this.store.select(selectDataCity).subscribe(data =>
        this.filteredCities =  [...data].map(city =>{
        const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
        return {
          ...city,  
          translatedName 
        };
      })
      .filter(city => city.country_id === country_id)
      .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
      }));
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
 
    branch.translation_data = [];
    const enFields = [
      { field: 'name', name: 'name' },
      { field: 'description', name: 'description' },
    ];
    const arFields = [
      { field: 'name_ar', name: 'name' },
      { field: 'description_ar', name: 'description' },
  
    ];
    // Create the English translation if valid
     const enTranslation = this.formUtilService.createTranslation(branch,'en', enFields);
     if (enTranslation) {
      branch.translation_data.push(enTranslation);
     }

     // Create the Arabic translation if valid
     const arTranslation = this.formUtilService.createTranslation(branch,'ar', arFields);
     if (arTranslation) {
      branch.translation_data.push(arTranslation);
     }
     if(branch.translation_data.length <= 0)
       delete branch.translation_data;
          // Dynamically remove properties that are undefined or null at the top level of city object
    
      Object.keys(branch).forEach(key => {
      if (branch[key] === undefined || branch[key] === null) {
          delete branch[key];  // Delete property if it's undefined or null
       }
    });
    delete branch.name;
    delete branch.name_ar;
    delete branch.description;
    delete branch.description_ar;
    delete branch.area_id;

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
      if(this.uploadedFiles){
          const images: any[] = [];
          this.uploadedFiles.forEach(file => {
            images.push(file.dataURL); // Push each Base64 string into the images array
        });
          newData.images =  images;
          this.storeForm.get('images').setValue(images);
        
      }
      if(!this.isEditing)
        {           
              delete newData.id;
              newData = this.createStoreFromForm(newData);
              console.log(newData);

              delete newData.status;
              //Dispatch Action
              this.store.dispatch(addStorelist({ newData }));
        }
        else
        { 
          if(this.uploadedFiles)
            this.storeForm.get('images').setValue(this.originalStoreData.images);

   
          const updatedDta = this.formUtilService.detectChanges(this.storeForm, this.originalStoreData);
          if (Object.keys(updatedDta).length > 0) {
            const changedData = this.createStoreFromForm(updatedDta);
            if(this.uploadedFiles)
              changedData.images = this.parseImages(this.uploadedFiles);
            changedData.id = this.storeForm.value.id;
            delete changedData.status;
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
    
      this.router.navigateByUrl('/private/stores');

  }
  onChangeEventEmit(event: any){
    console.log(event);

  }
}