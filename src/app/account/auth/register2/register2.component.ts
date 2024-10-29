import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { Observable } from 'rxjs';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.scss']
})
export class Register2Component implements OnInit {

  signupForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  submitted: any = false;
  error: any = '';
  successmsg: any = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  
  countrylist: any[] = [];
  arealist$:  Observable<any[]>  ;
  citylist$:  Observable<any[]> ;
  loading$: Observable<any>;


  sectionlist:  any[] = [];

  filteredAreas :  any[] = [];
  filteredCities:  any[] = [];

 
  constructor  (
    private formBuilder: UntypedFormBuilder, 
    private router: Router, 
    public store: Store) { 

      this.loading$ = this.store.pipe(select(selectDataLoading));
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 10, status: 'active' }));


  }
  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit() {
    document.body.classList.add("auth-body-bg");

    this.store.select(selectDataCountry).subscribe((data) =>{
        this.countrylist = data;
    });
    this.arealist$ = this.store.select(selectDataArea);
    this.citylist$ = this.store.select(selectDataCity);
   
    this.store.select(selectDataSection).subscribe((data) => {
      this.sectionlist = [...data].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });


    this.signupForm = this.formBuilder.group({
      
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confpassword: ['', Validators.required],
      id_number: ['', Validators.required],
      phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
      country_id:[''],
      city_id:[''],
      area_id:[''], 
      serviceType: [''],
      supervisorName: [''],
      supervisorPhone: [''],
      bankAccountNumber: [''],
      merchantName:['', Validators.required],
      merchantPicture: [''],
      merchantLogo: [''],
      section_id:[''],
      website: [''],
      whatsup:[''],
      facebook: [''],
      twitter: [''],
      instagram: [''],

    }, {validators: [this.passwordMatchValidator]});
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
  
  onChangeCountrySelection(event: any){
    const country = event.target.value;
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
  onChangeAreaSelection(event: any){
    const area = event.target.value;
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
    this.signupForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.signupForm.get('supervisorPhone').setValue(phoneNumber);
  }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };

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
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
      
      
      const newData = this.signupForm.value;
      if(this.storeLogoBase64){
        newData.merchantLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
      delete newData.confpassword;
  
      //Dispatch Action
      this.store.dispatch(Register({ newData }));

   
  }
  private focusOnFirstInvalid() {
    const firstInvalidControl = this.getFirstInvalidControl();
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  private getFirstInvalidControl(): HTMLInputElement | null {
    const controls = this.signupForm.controls;
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
  
  /**
   * Upload Store Logo
   */
  async uploadStoreLogo(event: any){
    try {
      const imageURL = await this.fileChange(event);
      //this.signupForm.controls['storeLogo'].setValue(imageURL);
      this.storeLogoBase64 = imageURL;
    } catch (error: any) {
      console.error('Error reading file:', error);
    }
  }
  /**
   * Upload Merchant Picture
   */
  async uploadMerchantPicture(event: any){
    try {
      const imageURL = await this.fileChange(event);
      //this.signupForm.controls['merchantPicture'].setValue(imageURL);
      this.merchantPictureBase64 = imageURL;
    } catch (error: any) {
      console.error('Error reading file:', error);
    }
    
  }
}
