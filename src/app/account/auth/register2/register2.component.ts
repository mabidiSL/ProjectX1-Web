/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CountryService } from 'src/app/core/services/country-code.service';
import { ConfigService } from 'src/app/core/services/config.service';

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
  fieldTextType: boolean = true;
  confirmFieldTextType: boolean = true;

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
  showTerms: boolean = false;

  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  @ViewChild('rightsection') rightsection: ElementRef<HTMLElement>;
  phoneCode!: string;
  termsText: string = ''; 

  constructor  (
    private readonly formBuilder: UntypedFormBuilder, 
    private readonly router: Router,
    private readonly randomBackgroundService: RandomBackgroundService,
    private readonly backgroundService: BackgroundService, 
    private readonly modalService: BsModalService,
    private readonly countrCodeService: CountryService,
    private readonly configService: ConfigService,
    private readonly  formUtilService: FormUtilService,
    public store: Store) { 

      this.loading$ = this.store.pipe(select(selectDataLoading));
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
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
      sections:[[], Validators.required],
      website: [null],
      termsAndConditions: [false, Validators.requiredTrue] 

      

    }, {validators: [this.passwordMatchValidator]});
  }
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 

  ngOnInit() {
    this.configService.loadTermsAndConditions().subscribe(
      (terms)=>{
        this.termsText = terms;
        console.log(this.termsText);
        
      });
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
  onTermsChange(event: Event) {
    this.showTerms = (event.target as HTMLInputElement).checked;
  }
  fetchCountry(){
    this.store.select(selectDataCountry).subscribe((data) =>{
      this.countrylist = [...data].map(country =>{
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
       // if(section.translation_data[0]?.language==='en'){
        // Extract the translated name (assuming translation_data[0] exists)
        const translatedName = section.translation_data?.[0]?.name || 'No name available';
        return {
          ...section,  // Spread the original section data
          translatedName // Add the translatedName property for easy binding
        };
    /* }*/
     }).sort((a, b) => {
        // Sort by translatedName
        return a.translatedName.localeCompare(b.translatedName);
      });
    });
  console.log(this.sectionlist);
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
  
 
  onPhoneNumberChanged(event: { number: string; countryCode: string }) {
    this.signupForm.get('phone').setValue(event.number);
  }
  async getCountryCode(country_id: number) {
    
    
    const country = this.countrylist.find(c => c.id === country_id);
    
    try {
      this.phoneCode = await this.countrCodeService.getCountryByCodeOrIso(country?.phoneCode);
    } catch (error) {
      console.error('Error fetching country code:', error);
    }
  }
  onChangeCountrySelection(event: Country){
    if(event){  
    this.getCountryCode(event.id);  
    }
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
      delete newData.termsAndConditions;
      const register = this.createMerchantFromForm(newData);
      
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
    const merchantFields = ['merchantName','sections','country_id', 'website' ]; // Update based on the step
    const managerFields = ['f_name','l_name','email', 'password', 'confpassword', 'phone', 'termsAndConditions'];
    

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
