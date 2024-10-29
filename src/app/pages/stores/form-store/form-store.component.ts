import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, EMPTY, filter, map, switchMap } from 'rxjs';
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


@Component({
  selector: 'app-form-store',
  templateUrl: './form-store.component.html',
  styleUrl: './form-store.component.css'
})
export class FormStoreComponent implements OnInit {
  
  @Input() type: string;
  storeForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  
  private destroy$ = new Subject<void>();
  
  public currentUser: Observable<_User>;

  merchantlist$: Observable<any[]>;
  countrylist$: Observable<any[]>;
  arealist$: Observable<any[]>;
  citylist$: Observable<any[]>;
  loading$: Observable<any>

  merchantList: any[] = [];

  merchantId: number =  null;
  filteredAreas : any[];
  filteredCities: any[];
  currentRole: string = '';
  submitted: any = false;
  error: any = '';
  successmsg: any = false;
  fieldTextType!: boolean;
  fromPendingContext: boolean = false;

  imageURL: string | undefined;
  existantStoreLogo: string = null;
  existantStorePicture: string = null
  StorePictureBase64: string = null;
  storeLogoBase64: string = null;
  isEditing: boolean = false;
  uploadedFiles: any[] = [];
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
    public store: Store) {

      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading));

      this.currentRole = this.getCurrentUser()?.role.name;
      this.merchantId =  this.getCurrentUser()?.merchantId;

      this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 10 , status: 'active'}));
      this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 10 , status: 'active'}));
      this.store.dispatch(fetchArealistData({ page: 1, itemsPerPage: 10 , status: 'active'}));
      this.store.dispatch(fetchCitylistData({ page: 1, itemsPerPage: 10 , status: 'active'}));
      
      this.initForm();

      
     }
  // set the currenr year
  year: number = new Date().getFullYear();
   
  private initForm() {
    this.storeForm = this.formBuilder.group({
      
      id: [''],
      name: ['', Validators.required],
      description: [''],
      phone: ['', Validators.required ],
      merchant_id: ['', Validators.required],
      city_id:['', Validators.required],
      area_id:['',  Validators.required], 
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
      this.merchantlist$.subscribe((data) => { this.merchantList = data});
      this.countrylist$ = this.store.select(selectDataCountry);
      this.arealist$ = this.store.select(selectDataArea);
      this.citylist$ = this.store.select(selectDataCity);
   
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
        .pipe(select(selectStoreById(StoreId)), takeUntil(this.destroy$))
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
            this.storeForm.patchValue(Store);
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
    const value = this.merchantList.find(merchant => merchant.id === MerchantId)?.merchantName ;
    return value;
  }
  getAreaName(id: any){
    return this.filteredAreas.find(area => area.id === id)?.name ;
  }
  getCityName(id: any){
    return this.filteredCities.find(city => city.id === id)?.name ;
  }
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
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
    let returnedImages: any[] = [];

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
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
          
      const newData = this.storeForm.value;
      delete newData.area_id;

          if(!this.isEditing)
            {           
              if(this.uploadedFiles){
                let images: any[] = [];
                this.uploadedFiles.forEach(file => {
                  images.push(file.dataURL); // Push each Base64 string into the images array
              });
              newData.images =  images;
              }
              delete newData.id;
              //Dispatch Action
              this.store.dispatch(addStorelist({ newData }));
        }
        else
        {
          
          newData.images = this.parseImages(this.uploadedFiles);
         // delete newData.images;
          delete newData.area_id;
          this.store.dispatch(updateStorelist({ updatedData: newData }));
        }
    
  }
  private focusOnFirstInvalid() {
    const firstInvalidControl = this.getFirstInvalidControl();
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  private getFirstInvalidControl(): HTMLInputElement | null {
    const controls = this.storeForm.controls;
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