/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { selectDataLoading, selectedContact } from 'src/app/store/contacts/contacts-selector';
import { getContactById } from 'src/app/store/contacts/contacts.action';
import { Contact } from 'src/app/store/contacts/contacts.model';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { selectDataCompany } from 'src/app/store/companies/companies-selector';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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

userAddress: string = '';
private  readonly destroy$ = new Subject<void>();
contactForm: UntypedFormGroup;
@ViewChild('newContactModal', { static: false }) showModal?: TemplateRef<any>;


constructor(
  public modalRef: BsModalRef,
  private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalService: BsModalService,
    private readonly formUtilService: FormUtilService) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.initForm();
  
  
}

initForm(){
  this.contactForm = this.formBuilder.group({
    f_name: ['', Validators.required],
    l_name: ['', Validators.required],
    contact_type: ['', Validators.required],
    job_title: ['', Validators.required],
    company_id: ['', Validators.required],
    email: ['', Validators.required],
    mobile: ['', Validators.required],
    phone: ['', Validators.required],
    address_building: ['', Validators.required],
    address_street: ['', Validators.required],
    address_town: ['', Validators.required],
    address_county: ['', Validators.required],
    address_city: ['', Validators.required],
    address_postcode: ['', Validators.required]
  });
}
ngOnInit() {
  this.fetchCompanies();
  const contactId = this.route.snapshot.params['id'];
  if(contactId){
    if (this.type === 'view') {
      this.formUtilService.disableFormControls(this.contactForm);
     }
    this.store.dispatch(getContactById({ ContactId:  contactId}));
    this.store.pipe(select(selectedContact), takeUntil(this.destroy$))
    .subscribe(contact => {
      if(contact){
        console.log(contact);
        this.userAddress = contact.address_building + ' ' + contact.address_street + ' ' + contact.address_town + ' ' + contact.address_county + ' ' + contact.address_city + ' ' + contact.address_postcode;
        if(this.userAddress.trim() === '' || this.userAddress.includes('null')){
          this.userAddress = 'No Address';
        }
        this.Contact = contact;
        this.isEditing = true;
      }
    });
    
  }
  console.log(contactId);
}
fetchCompanies(){
  this.store.dispatch(fetchCompaniesData({page: 1, itemsPerPage: 100, query: ''}));
  this.store.pipe(select(selectDataCompany)) .subscribe(companies => {
    this.companies = companies;
  });
}
onSubmit(){
  console.log(this.contactForm.value);
}
onClose(): void {
  // Close the modal when the close button or cancel button is clicked
  this.modalRef.hide();
}
}