/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { selectDataLoading, selectedCompany } from 'src/app/store/companies/companies-selector';
import { addCompanies, getCompanyById, fetchCompaniesData, updateCompanies } from 'src/app/store/companies/companies.action';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { selectDataCompany } from 'src/app/store/companies/companies-selector';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Company } from 'src/app/store/companies/companies.model';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { Country } from 'src/app/store/country/country.model';

@Component({
  selector: 'app-form-company',
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.scss'
})
export class FormCompanyComponent implements OnInit {
/* eslint-disable @typescript-eslint/no-explicit-any */
@Input() type: string;
@Input() data: number = null;
@Input() title: string;
loading$: Observable<boolean>;
loadingQuotes$: Observable<boolean>;
loadingWins$: Observable<boolean>;
companys$: Observable<Company[]>;
companies: Company[] = [];
Company : any = null;
isEditing: boolean;
currentCompany: Company = null;
originalCompany: Company = null;
globalId: number = null;
formSubmitted = false;
formError: string | null = null;
userAddress: string = '';
countries: Country[] = [];


private  readonly destroy$ = new Subject<void>();
companyForm: UntypedFormGroup;
@ViewChild('newCompanyModal', { static: false }) showModal?: TemplateRef<any>;
@ViewChild('formElement', { static: false }) formElement: ElementRef;


constructor(
  public modalRef1: BsModalRef,
    private readonly store: Store,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly formUtilService: FormUtilService) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.initForm();
 
}

initForm(){
  this.companyForm = this.formBuilder.group({
    id: [null],
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    sector: [null, Validators.required],
    web_url: [null, [Validators.required, Validators.email]],
    tel_number: [''],
    tel_country_dial_code_id: [null],
    address_building: [null],
    address_street: [null],
    address_town: [null],
    address_county: [null],
    address_city: [null],
    address_postcode: [null],
    address_country_id: [null],
    social_instagram: [null],
  });
}
ngOnInit() {
  this.fetchCountry();
  // Log the data passed in the data property
  console.log('data', this.data);
  
  const companyId = this.data;
  if(companyId){
    if (this.type === 'view') {
      this.formUtilService.disableFormControls(this.companyForm);
     }
    this.store.dispatch(getCompanyById({ CompanyId:  companyId}));
    this.store.pipe(select(selectedCompany), takeUntil(this.destroy$))
    .subscribe(company => {
      if(company){
        console.log(company);
        
        this.Company = company;
        this.patchValueForm(company);
        this.originalCompany = { ...company };
        this.globalId = company.id;
        this.isEditing = true;
      }
    });
    
  }
  console.log(companyId);
}
onCountryChange(event: any){
  if(event){
    console.log('event', event);
    this.companyForm.get('address_country').setValue(event.id);
  }
}
fetchCountry(){
  this.store.select(selectDataCountry).subscribe((data) =>{
    this.countries = [...data].map(country =>{
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
patchValueForm(company: Company){
  this.companyForm.patchValue(company);
  this.companyForm.get('tel_number').setValue( '+'+ company.tel_country_dial_code_id+ ' ' + company.tel_number);
        
}
fetchCompanies(){
  this.store.dispatch(fetchCompaniesData({page: 1, itemsPerPage: 100, query: ''}));
  this.store.pipe(select(selectDataCompany)) .subscribe(companies => {
    this.companies = [...companies].map(company =>{
      const translatedName = company.translation_data?.[0]?.name || 'No name available';
      return {
        ...company,  
        translatedName 
      };
    }).sort((a, b) => {
      // Sort by translatedName
      return a.translatedName.localeCompare(b.translatedName);
    });
  });
}
createCompanyObject(formValue): Company {
  const company = formValue;
  company.translation_data = [];
  const enFields = [
    { field: 'first_name', name: 'first_name' },
    { field: 'last_name', name: 'last_name' },
  ];
 
 // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(company,'en', enFields );
  if (enTranslation) {
    company.translation_data.push(enTranslation);
  }
  
  if(company.translation_data.length <= 0)
    delete company.translation_data;
  // Dynamically remove properties that are undefined or null at the top level of city object
  Object.keys(company).forEach(key => {
    if (company[key] === undefined || company[key] === null) {
        delete company[key];  // Delete property if it's undefined or null
     }
  });
 delete company.first_name;
 delete company.last_name;
 return company;
}

onCompanyPhoneNumberChanged(event: { number: string; countryCode: string }) {
  this.handlePhoneNumberChange(event, 'mob_tel_country_dial_code_id', 'mob_tel_number');
}

onCompanyTelephoneNumberChanged(event: { number: string; countryCode: string }) {
  this.handlePhoneNumberChange(event, 'tel_country_dial_code_id', 'tel_number');
}
handlePhoneNumberChange(event: { number: string; countryCode: string }, countryCodeField: string, numberField: string) {
  this.companyForm.get(countryCodeField).setValue(event.countryCode);

  if (event.number.startsWith('+' + event.countryCode)) {
    const length = event.countryCode.length;
    const numberWithoutCode = event.number.substring(length + 1).trim();
    console.log('numberWithoutCode', numberWithoutCode);
    this.companyForm.get(numberField).setValue(numberWithoutCode);
  }
  
  console.log('event', event);
}
onSubmit() {
  this.formSubmitted = true;
  if (this.companyForm.invalid) {
    this.formError = 'Please complete all required fields.';
    Object.keys(this.companyForm.controls).forEach(control => {
      this.companyForm.get(control).markAsTouched();
    });
    this.formUtilService.focusOnFirstInvalid(this.companyForm);
    return;
  }
    this.formError = null;
    const newData = this.companyForm.value;
  
    this.currentCompany = this.createCompanyObject(newData);
    if(!this.isEditing)
      {  
        delete this.currentCompany.id;
        console.log('newData', this.currentCompany);
        
        //Dispatch Action
        this.store.dispatch(addCompanies({ newData: this.currentCompany }));
        this.modalRef1.hide();

      }
      else
      { 
       
        console.log('before detecting changes  form', this.companyForm.value, 'original', this.originalCompany);
        const updatedDta = this.formUtilService.detectChanges(this.companyForm, this.originalCompany);
        console.log('after detecting changes ', updatedDta);
        
        if (Object.keys(updatedDta).length > 0) {
          this.currentCompany = this.createCompanyObject(updatedDta);
          this.currentCompany.id = this.globalId;
          this.store.dispatch(updateCompanies({ updatedData: this.currentCompany }));
          this.modalRef1.hide();

        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
    
}
onClose(): void {
  // Close the modal when the close button or cancel button is clicked
  this.modalRef1.hide();
}
}