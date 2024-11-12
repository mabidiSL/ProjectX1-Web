import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { addMerchantlist, getLoggedMerchantById, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectedMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { Merchant } from '../../../store/merchantsList/merchantlist1.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { Area } from 'src/app/store/area/area.model';
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
  existantmerchantLogo: string = null;
  existantmerchantPicture: string = null
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  isEditing: boolean = false;
  fromPendingContext: boolean = false;

  countrylist: Country[] = [];
  arealist$:  Observable<Area[]>  ;
  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>;

  sectionlist:  SectionListModel[] = [];
  
  filteredCountries: Country[] = [];
  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  serviceTypes: string[] = ['company', 'entreprise'];
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

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 1000, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10000, status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
     
      this.initForm();
      
     }

     get passwordMatchError() {
      return (
        this.merchantForm.getError('passwordMismatch') &&
        this.merchantForm.get('confpassword')?.touched
      );
    }
  
    passwordMatchValidator(formGroup: FormGroup) {
      const newPassword = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confpassword')?.value;
    
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          formGroup.get('confpassword')?.setErrors({ passwordMismatch: true });
          return { passwordMismatch: true }; // Return an error object
        } else {
          formGroup.get('confpassword')?.setErrors(null); // Clear errors if they match
        }
      }
    
      return null; // Return null if valid
    }
   private initForm() {
    this.merchantForm = this.formBuilder.group({
    id: [null],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', this.type === 'create' ? Validators.required : null],
    confpassword: ['', this.type === 'create' ? Validators.required : null],
    id_number: [null, Validators.required],
    phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
    country_id:[null, Validators.required],
    city_id:[null, Validators.required],
    area_id:[null, Validators.required], 
    serviceType: [null, Validators.required],
    supervisorName: ['', Validators.required],
    supervisorName_ar: ['', Validators.required],
    supervisorPhone: ['', Validators.required],
    bankAccountNumber: [''],
    merchantName:['', Validators.required],
    merchantName_ar:['', Validators.required],
    merchantPicture: ['', Validators.required],
    merchantLogo: ['', Validators.required],
    activationCode: [''],
    qrCode: [''],
    section_id:[null, Validators.required],
    website: [undefined],
    whatsup:[null],
    facebook: [undefined],
    twitter: [undefined],
    instagram: [undefined]
    

  }, {
    validators: this.type === 'create' ? this.passwordMatchValidator : null 
  });} 
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 
  globalId : number = null;

  ngOnInit() {
    
    this.store.select(selectDataCountry).subscribe((data) =>{
        this.filteredCountries = data;
    });
    this.arealist$ = this.store.select(selectDataArea);
    this.arealist$.subscribe((areas) => { this.filteredAreas = areas});
    

    this.citylist$ = this.store.select(selectDataCity);
    this.citylist$.subscribe((cities) => { this.filteredCities = cities});
  
    this.store.select(selectDataSection).subscribe((data) => {
      this.sectionlist = [...data].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });


    const merchantId = this.route.snapshot.params['id'];
    if (merchantId) {
      // Dispatch action to retrieve the merchant by ID
      this.store.dispatch(getLoggedMerchantById({ merchantId }));
      
      // Subscribe to the selected merchant from the store
      this.store
        .pipe(select(selectedMerchant), takeUntil(this.destroy$))
        .subscribe((merchant: Merchant) => {
          if (merchant) {
            console.log(merchant);

           
            this.existantmerchantLogo = merchant.merchantLogo;
            this.existantmerchantPicture = merchant.merchantPicture;
            this.fileName1 = merchant.merchantLogo.split('/').pop();
            this.fileName2 = merchant.merchantPicture.split('/').pop();
            

            this.merchantForm.controls['country_id'].setValue(merchant.user.city.area.country_id);
            this.merchantForm.controls['area_id'].setValue(merchant.user.city.area_id);
            this.merchantForm.controls['city_id'].setValue(merchant.user.city_id);
            this.merchantForm.controls['section_id'].setValue(merchant.section_id);

            this.merchantForm.patchValue(merchant);
            this.globalId = merchant.id;
            this.merchantForm.patchValue(merchant.user);

            this.originalMerchantData = { ...merchant };

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
  getCountryName(id: number){
    return this.filteredCountries.find(country => country.id === id)?.translation_data[0].name ;
  }
  getAreaName(id: number){
    return this.filteredAreas.find(area => area.id === id)?.translation_data[0].name ;
  }
  getCityName(id: number){
    return this.filteredCities.find(city => city.id === id)?.translation_data[0].name ;
  }
  getSectionName(id: number){
    return this.sectionlist.find(section => section.id === id)?.name ;
  }
  

  onChangeCountrySelection(event: number){
    
    const country = event;
    if(country){
      this.arealist$.subscribe(
        areas => 
          this.filteredAreas = areas.filter(c =>c.country_id == country )
      );
    }
    else{
      this.filteredAreas = [];
    }
    
  }
  onChangeAreaSelection(event: number){
    const area = event;
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

  onPhoneNumberChanged(phoneNumber: string) {
    this.merchantForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.merchantForm.get('supervisorPhone').setValue(phoneNumber);
  }
  // convenience getter for easy access to form fields
  get f() { return this.merchantForm.controls; }
  
  createMerchantFromForm(formValue): Merchant {
      //const formValue = this.merchantForm.value;
      const merchant: Merchant = {
      
          id : Number(this.globalId),
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
          id_number: Number(formValue.id_number),
          phone: formValue.phone,
          translation_data: [
            {
              name: formValue.merchantName? formValue.merchantName: null, 
              supervisorName: formValue.supervisorName? formValue.supervisorName: null,   
              language: 'en',        
            },
            {
              name: formValue.merchantName_ar? formValue.merchantName_ar: null ,  
              supervisorName: formValue.supervisorName_ar? formValue.supervisorName_ar: null ,   
              language:'ar',              
            }
          ],
          serviceType: formValue.serviceType,
          supervisorPhone: formValue.supervisorPhone,
          merchantLogo : formValue.merchantLogo,
          merchantPicture: formValue.merchantPicture,
          bankAccountNumber : formValue.bankAccountNumber,
          section_id: Number(formValue.section_id),
          city_id : Number(formValue.city_id),
          
          }
          if (formValue.website) {
            merchant.website = formValue.website;
          }
          if (formValue.facebook) {
            merchant.facebook = formValue.facebook;
          }
          if (formValue.twitter) {
            merchant.twitter = formValue.twitter;
          }
          if (formValue.instagram) {
            merchant.twitter = formValue.instagram;
          }
          if (formValue.whatsup) {
            merchant.whatsup = Number(formValue.whatsup);
          }
          merchant.translation_data = merchant.translation_data.map(translation => {
            // Iterate over each property of the translation and delete empty values
            Object.keys(translation).forEach(key => {
              if (translation[key] === '' || translation[key] === null || translation[key] === undefined) {
                delete translation[key];  // Remove empty fields
              }
            });
            return translation; // Return the modified translation object
          });
            // Dynamically remove properties that are undefined or null at the top level of city object
            Object.keys(merchant).forEach(key => {
              if (merchant[key] === undefined || merchant[key] === null) {
                delete merchant[key];  // Delete property if it's undefined or null
              }
            });
          
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
      //const newData = this.merchantForm.value;
      const newData = this.merchantForm.value;
      console.log(newData);
      if(this.storeLogoBase64){
        newData.merchantLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
      delete newData.confpassword;
      delete newData.area_id;
      delete newData.country_id;
      delete newData.qrCode;
      delete newData.activationCode;

      this.merchant = this.createMerchantFromForm(newData);
      if(!this.isEditing)
        {  
          delete this.merchant.id;
          //this.merchant = newData;
          console.log(this.merchant);
          //Dispatch Action
          this.store.dispatch(addMerchantlist({ newData: this.merchant }));
        }
        else
        { 
          delete this.merchant.password;
          delete this.merchant.email;
          const updatedDta = this.formUtilService.detectChanges(this.merchantForm, this.originalMerchantData);
          if (Object.keys(updatedDta).length > 0) {
            this.merchant = this.createMerchantFromForm(updatedDta);

            console.log(this.merchant);
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
        this.merchantForm.controls['merchantPicture'].setValue(this.existantmerchantPicture);
      }
    }
    
    onLogoUpload(event: UploadEvent): void {
      if (event.type === 'logo') {
        // Handle Logo Upload
        this.storeLogoBase64 = event.file;
        this.fileName1 = ''; // Set the file name
        this.existantmerchantLogo = event.file;
        this.merchantForm.controls['merchantLogo'].setValue(this.existantmerchantLogo);
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

    if(this.fromPendingContext)
      this.router.navigateByUrl('/private/merchants/approve');
    else
      this.router.navigateByUrl('/private/merchants/list');

  }

}