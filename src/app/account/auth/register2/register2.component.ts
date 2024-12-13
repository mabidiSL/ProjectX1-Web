/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { Observable } from 'rxjs';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataLoading, selectRegistrationSuccess } from 'src/app/store/Authentication/authentication-selector';
import { Country } from 'src/app/store/country/country.model';
import { Area } from 'src/app/store/area/area.model';
import { City } from 'src/app/store/City/city.model';
import { SectionListModel } from 'src/app/store/section/section.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { RandomBackgroundService } from 'src/app/core/services/setBackgroundEx.service';
import { BackgroundService } from 'src/app/core/services/background.service';
import { CdkStepper } from '@angular/cdk/stepper';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalsComponent } from 'src/app/shared/ui/modals/modals.component';
import { passwordValidator } from 'src/app/shared/validator/passwordValidator';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.scss']
})
export class Register2Component implements OnInit, OnDestroy, AfterViewInit {

  signupForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  confirmFieldTextType: boolean = false;

  imageURL: string | undefined;
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  
  countrylist: Country[] = [];
  arealist$:  Observable<Area[]>  ;
  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>;
  existantmerchantLogo: string = null;
  existantmerchantPicture: string = null

  sectionlist:  SectionListModel[] = [];
  modalRef?: BsModalRef;

  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  @ViewChild('rightsection') rightsection: ElementRef<HTMLElement>;

 
  constructor  (
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private randomBackgroundService: RandomBackgroundService,
    private backgroundService: BackgroundService, 
    private modalService: BsModalService,
    private formUtilService: FormUtilService,
    public store: Store) { 

      this.loading$ = this.store.pipe(select(selectDataLoading));
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 100, query:'', status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.initForm();


  }
  initForm(){
    

    this.signupForm = this.formBuilder.group({
      
      f_name: [null, Validators.required],
      l_name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: ['', [Validators.required,passwordValidator()]],
      confpassword: ['', Validators.required],
      phone:[null,Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
      jobTitle: [null],
      country_id:[null, Validators.required],   
      merchantName:['', Validators.required],
      section_id:[null, Validators.required],
      website: [null],
      

    }, {validators: [this.passwordMatchValidator]});
  }
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 

  ngOnInit() {
    document.body.classList.add("auth-body-bg");

    this.store.pipe(select(selectRegistrationSuccess)).subscribe((success) => {
      if (success) {
        this.successmsg = true;
        this.showModal();
      }
    });
   

    this.fetchCountry();
    
    this.fetchSection();
    
  }
  ngAfterViewInit() {
    const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    if (this.rightsection) {
      this.randomBackgroundService.getRandomBackground(direction).subscribe(
        (randomImage) => {
          this.backgroundService.setBackgroundElement(this.rightsection.nativeElement, randomImage);
        },
        (error) => {
          console.error('Error setting random background:', error);
        }
      );
    }
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
 

  get passwordMatchError() {
    return (
      this.signupForm.getError('passwordMismatch') &&
      this.signupForm.get('confpassword')?.touched
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
  
 
  onPhoneNumberChanged(phoneNumber: string) {
    this.signupForm.get('phone').setValue(phoneNumber);
  }

 
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }


  createMerchantFromForm(formValue): Merchant {
    const merchant = formValue;
    merchant.translation_data = [];
    const enFields = [
      { field: 'merchantName', name: 'name' },
      { field: 'f_name', name: 'f_name' },
      { field: 'l_name', name: 'l_name' },


    ];
    
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
   delete merchant.l_name;
   delete merchant.f_name;
   return merchant;
}
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;
    console.log('i am on register submit');

    if (this.signupForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.signupForm.controls).forEach(control => {
        this.signupForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.signupForm);
      return;
    }
    this.formError = null;
      
      
      const newData = this.signupForm.value;
      delete newData.confpassword;
      const register = this.createMerchantFromForm(newData);
      console.log(register);
      
      //Dispatch Action
      this.store.dispatch(Register({ newData: register }));

   
  }
  
  onCancel(){
 
    this.signupForm.reset();
    this.router.navigateByUrl('/auth/login');
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
  

  
 
  isStepValid(stepIndex: number): boolean {
    // Logic to validate current step fields
    const merchantFields = ['merchantName','section_id','country_id', 'website' ]; // Update based on the step
    const managerFields = ['f_name','l_name','email', 'password', 'confpassword', 'phone'];
    

    if(stepIndex == 0)
    {  
      return merchantFields.every((field) => this.signupForm.get(field)?.valid);
    }
    if(stepIndex == 1){
      
      return managerFields.every((field) => this.signupForm.get(field)?.valid);
    }
   
    return true;
  }
  ngOnDestroy(): void {
    this.backgroundService.resetBackground();
  }
  /**
   * Open modal
   * @param content modal content
   */
        openModal(content: any) {
          this.modalRef = this.modalService.show(content);
        } 

  
        showModal(): void {
          this.modalRef = this.modalService.show(ModalsComponent, {
            initialState: {
              message: 'Registration completed. Check your inbox soon!'
            }
          });
        }
      
        
}
