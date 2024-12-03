/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { Area } from 'src/app/store/area/area.model';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { City } from 'src/app/store/City/city.model';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { Country } from 'src/app/store/country/country.model';
import { selectDataLoading, selectedCustomer } from 'src/app/store/customer/customer-selector';
import { getCustomerById } from 'src/app/store/customer/customer.action';
import { Customer } from 'src/app/store/customer/customer.model';



@Component({
  selector: 'app-form-customer',
  templateUrl: './form-customer.component.html',
  styleUrl: './form-customer.component.scss'
})
export class FormCustomerComponent  implements OnInit, OnDestroy{
  
  @Input() type: string;
  customerForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  isEditing: boolean = false;
  private destroy$ = new Subject<void>();
  bsConfig: Partial<BsDatepickerConfig>;

  fileName1: string = ''; 



  banks : any[] = [{id: '1', name:'Riyad Bank'},{id: '2', name:'Al Bilad Bank'}];
  gender: string[] = ['male', 'female'];
  
  countrylist: Country[] = [];
  arealist$:  Observable<Area[]>  ;
  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>
  originalCustomerData : Customer = {};
  existantImage: string = null

  permissions: any = {};
  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  @ViewChild('formElement', { static: false }) formElement: ElementRef;





  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formUtilService: FormUtilService,
    private datepickerConfigService: DatepickerConfigService,
    private store: Store){
      
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 1000, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 1000, status: 'active' }));

      this.initForm();
      this.bsConfig = this.datepickerConfigService.getConfig();


    }
  
    private initForm() {
      this.customerForm = this.formBuilder.group({
        id: [null],
        l_name:['',Validators.required],
        l_name_ar:['',Validators.required],
        f_name:['',Validators.required],
        f_name_ar:['',Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
        country_id:[null],
        city_id:[null],
        area_id:[null], 
        image:[''],
        wallet:[0],
        loyaltyPoint: [0],
        registrationDate:['']
      });
    }
  ngOnInit() {
    this.fetchCountry();
    this.fetchAreas();
    this.fetchCities();
     
     
    const customerId = this.route.snapshot.params['id'];
    if (customerId) {
      // Dispatch action to retrieve the customer by ID
      this.store.dispatch(getCustomerById({ customerId }));
      
      // Subscribe to the selected customer from the store
      this.store
        .pipe(select(selectedCustomer), takeUntil(this.destroy$))
        .subscribe(customer => {
          if (customer) {
  
            
            this.customerForm.controls['country_id'].setValue(customer.city.area.country_id);
            this.customerForm.controls['area_id'].setValue(customer.city.area_id);
            this.customerForm.controls['city_id'].setValue(customer.city_id);
            this.patchValueForm(customer);
            
               
            this.originalCustomerData = { ...customer };
            this.isEditing = true;

          }
        });
    }
       
  }
  patchValueForm(customer: Customer){
    this.customerForm.patchValue(customer);
    this.customerForm.patchValue({
      f_name: customer.translation_data[0].f_name,
      l_name: customer.translation_data[0].l_name,
      f_name_ar: customer.translation_data[1].f_name,
      l_name_ar: customer.translation_data[1].l_name,
           
    });
  
  }
  
  fetchCountry(){
    this.store.select(selectDataCountry).subscribe((data) =>{
      this.countrylist = [...data].map(country =>{
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
    this.customerForm.get('area_id').setValue(null);
    this.customerForm.get('city_id').setValue(null);
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
    this.customerForm.get('city_id').setValue(null);
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
  
  createCustomerFromForm(formValue): Customer {
    const customer = formValue;
    customer.translation_data = [];
  
    const enFields = [
      { field: 'f_name', name: 'f_name' },
      { field: 'l_name', name: 'l_name' }
        
    ];
    const arFields = [
      { field: 'f_name_ar', name: 'f_name' },
      { field: 'l_name_ar', name: 'l_name' },
          ];
    
    // Create the English translation if valid
    const enTranslation = this.formUtilService.createTranslation(customer,'en', enFields);
    if (enTranslation) {
      customer.translation_data.push(enTranslation);
    }

    // Create the Arabic translation if valid
    const arTranslation = this.formUtilService.createTranslation(customer,'ar', arFields);
    if (arTranslation) {
      customer.translation_data.push(arTranslation);
    }
    if(customer.translation_data.length <= 0)
      delete customer.translation_data;
       
          // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(customer).forEach(key => {
      if (customer[key] === undefined || customer[key] === null) {
          delete customer[key];  // Delete property if it's undefined or null
       }
    });
    delete customer.f_name;
    delete customer.l_name;
    delete customer.f_name_ar;
    delete customer.l_name_ar;
    delete customer.country_id;
    delete customer.area_id;
    delete customer.city;
  



   return customer;
}

  
onLogoUpload(event: UploadEvent): void {
  if (event.type === 'logo') {
    // Handle Logo Upload
    this.fileName1 = ''; // Set the file name
    this.existantImage = event.file;
    this.customerForm.controls['image'].setValue(this.existantImage);
  }
}
  onSubmit() {

    this.formSubmitted = true;
    if (this.customerForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.customerForm.controls).forEach(control => {
        this.customerForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.customerForm);
      return;
    }
    this.formError = null;
      const newData = this.customerForm.value;
      if(!this.isEditing)
        {
            delete newData.id;
            //this.store.dispatch(addEmployeelist({ newData: this.createEmployeeFromForm(newData) }));
        }
        else
        { 
      
          const updatedDta = this.formUtilService.detectChanges(this.customerForm, this.originalCustomerData);

          if (Object.keys(updatedDta).length > 0) {
            updatedDta.id = this.customerForm.value.id;
            //this.store.dispatch(updateCustomerlist({ updatedData: this.createCustomerFromForm(updatedDta) }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
  
        }
    
  }
   
  onPhoneNumberChanged(phoneNumber: string) {
    this.customerForm.get('phone').setValue(phoneNumber);
  }
 
 
 

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    this.customerForm.reset();
    this.router.navigateByUrl('/private/customers');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/customers');
}

}
