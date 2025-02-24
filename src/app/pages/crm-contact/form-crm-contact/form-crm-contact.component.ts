/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { selectDataLoading, selectedContact } from 'src/app/store/contacts/contacts-selector';
import { addContacts, getContactById, updateContacts } from 'src/app/store/contacts/contacts.action';
import { Contact } from 'src/app/store/contacts/contacts.model';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { selectDataCompany } from 'src/app/store/companies/companies-selector';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Company } from 'src/app/store/companies/companies.model';
import { fetchCompaniesData } from 'src/app/store/companies/companies.action';

@Component({
  selector: 'app-form-crm-contact',
  templateUrl: './form-crm-contact.component.html',
  styleUrl: './form-crm-contact.component.scss'
})
export class FormCrmContactComponent implements OnInit {
@Input() type: string;
@Input() data: number = null;
@Input() title: string;
loading$: Observable<boolean>;
loadingQuotes$: Observable<boolean>;
loadingWins$: Observable<boolean>;
contacts$: Observable<Contact[]>;
companies: Company[] = [];
Contact : any = null;
isEditing: boolean;
currentContact: Contact = null;
originalContact: Contact = null;
globalId: number = null;
formSubmitted = false;
formError: string | null = null;
userAddress: string = '';
private  readonly destroy$ = new Subject<void>();
contactForm: UntypedFormGroup;
@ViewChild('newContactModal', { static: false }) showModal?: TemplateRef<any>;
@ViewChild('formElement', { static: false }) formElement: ElementRef;


constructor(
  public modalRef: BsModalRef,
    private readonly store: Store,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly formUtilService: FormUtilService) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.initForm();
 
}

initForm(){
  this.contactForm = this.formBuilder.group({
    id: [null],
    first_name: [null, Validators.required],
    last_name: [null, Validators.required],
    contact_type: [null],
    job_title: [null, Validators.required],
    company_id: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    mob_tel_number: ['', Validators.required],
    mob_tel_country_dial_code_id: [null,Validators.required],
    tel_number: [''],
    tel_country_dial_code_id: [null],
    address_building: [null],
    address_street: [null],
    address_town: [null],
    address_county: [null],
    address_city: [null],
    address_postcode: [null]
  });
}
ngOnInit() {
  this.fetchCompanies();
  // Log the data passed in the data property
  console.log('data', this.data);
  const contactId = this.data;
  if(contactId){
    if (this.type === 'view') {
      this.formUtilService.disableFormControls(this.contactForm);
     }
    this.store.dispatch(getContactById({ ContactId:  contactId}));
    this.store.pipe(select(selectedContact), takeUntil(this.destroy$))
    .subscribe(contact => {
      if(contact){
        console.log(contact);
        
        this.Contact = contact;
        this.contactForm.patchValue(contact);
        this.contactForm.get('mob_tel_number').setValue( '+'+ contact.mob_tel_country_dial_code_id+ ' ' + contact.mob_tel_number);
        this.contactForm.get('tel_number').setValue( '+'+ contact.tel_country_dial_code_id+ ' ' + contact.tel_number);

        this.contactForm.patchValue({
          first_name: contact.translation_data[0]?.first_name,
          last_name: contact.translation_data[0]?.last_name,
        });
        this.originalContact = { ...contact };
        this.globalId = contact.id;
        this.isEditing = true;
      }
    });
    
  }
  console.log(contactId);
}
patchValueForm(contact: Contact){
  this.contactForm.patchValue(contact);
  //this.contactForm.patchValue(contact.user);
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
createContactObject(formValue): Contact {
  const contact = formValue;
  contact.translation_data = [];
  const enFields = [
    { field: 'first_name', name: 'first_name' },
    { field: 'last_name', name: 'last_name' },
  ];
 
 // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(contact,'en', enFields );
  if (enTranslation) {
    contact.translation_data.push(enTranslation);
  }
  
  if(contact.translation_data.length <= 0)
    delete contact.translation_data;
  // Dynamically remove properties that are undefined or null at the top level of city object
  Object.keys(contact).forEach(key => {
    if (contact[key] === undefined || contact[key] === null) {
        delete contact[key];  // Delete property if it's undefined or null
     }
  });
 delete contact.first_name;
 delete contact.last_name;
 return contact;
}

onContactPhoneNumberChanged(event: { number: string; countryCode: string }) {
  this.handlePhoneNumberChange(event, 'mob_tel_country_dial_code_id', 'mob_tel_number');
}

onContactTelephoneNumberChanged(event: { number: string; countryCode: string }) {
  this.handlePhoneNumberChange(event, 'tel_country_dial_code_id', 'tel_number');
}
handlePhoneNumberChange(event: { number: string; countryCode: string }, countryCodeField: string, numberField: string) {
  this.contactForm.get(countryCodeField).setValue(event.countryCode);

  if (event.number.startsWith('+' + event.countryCode)) {
    const length = event.countryCode.length;
    const numberWithoutCode = event.number.substring(length + 1).trim();
    console.log('numberWithoutCode', numberWithoutCode);
    this.contactForm.get(numberField).setValue(numberWithoutCode);
  }
  
  console.log('event', event);
}
onSubmit() {
  this.formSubmitted = true;
  if (this.contactForm.invalid) {
    this.formError = 'Please complete all required fields.';
    Object.keys(this.contactForm.controls).forEach(control => {
      this.contactForm.get(control).markAsTouched();
    });
    this.formUtilService.focusOnFirstInvalid(this.contactForm);
    return;
  }
    this.formError = null;
    const newData = this.contactForm.value;
  
    this.currentContact = this.createContactObject(newData);
    if(!this.isEditing)
      {  
        delete this.currentContact.id;
        console.log('newData', this.currentContact);
        
        //Dispatch Action
        this.store.dispatch(addContacts({ newData: this.currentContact }));
        this.modalRef.hide();

      }
      else
      { 
       
        console.log('before detecting changes  form', this.contactForm.value, 'original', this.originalContact);
        const updatedDta = this.formUtilService.detectChanges(this.contactForm, this.originalContact);
        console.log('after detecting changes ', updatedDta);
        
        if (Object.keys(updatedDta).length > 0) {
          this.currentContact = this.createContactObject(updatedDta);
          this.currentContact.id = this.globalId;
          this.store.dispatch(updateContacts({ updatedData: this.currentContact }));
          this.modalRef.hide();

        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
    
}
onClose(): void {
  // Close the modal when the close button or cancel button is clicked
  this.modalRef.hide();
}
}