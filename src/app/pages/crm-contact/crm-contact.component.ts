/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectDataContact, selectDataLoading, selectDataTotalItems } from 'src/app/store/contacts/contacts-selector';
import { deleteContacts, fetchContactsData } from 'src/app/store/contacts/contacts.action';
import { Contact } from 'src/app/store/contacts/contacts.model';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { Country } from 'src/app/store/country/country.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { CreateCrmContactComponent } from './create-crm-contact/create-crm-contact.component';
import { EditCrmContactComponent } from './edit-crm-contact/edit-crm-contact.component';
@Component({
  selector: 'app-crm-contact',
  templateUrl: './crm-contact.component.html',
  styleUrl: './crm-contact.component.scss'
})
export class CrmContactComponent implements OnInit {
 // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;
  contactList: any[] = [];
  ContactList$: Observable<Contact[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchPlaceholder: string ='Search By Name, Email, Job Title or Company Name'
  filterTerm: string = '';
  searchTerm: string = '';
  countrylist: Country[] = [];
  modalRef?: BsModalRef | null = null;
  @ViewChild('ViewContent', { static: false }) showModal?: TemplateRef<any>;


  isDropdownOpen : boolean = false;
  filteredArray: Contact[] = [];
  originalArray: Contact[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];
  columns : any[]= [
    { property: 'translation_data[0]?.first_name', label: 'First Name' },
    { property: 'translation_data[0]?.last_name', label: 'Last Name' },
    { property: 'email', label: 'Email' },
    { property: 'job_title', label: 'Job Description' },
    { property: 'mob_tel_number', label: 'Mobile' },
    { property: 'company.translation_data[0]?.name', label: 'Company Name' },
  ];
  config:any = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  
  constructor(public store: Store, private readonly modalService: BsModalService) {
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
      this.ContactList$ = this.store.pipe(select(selectDataContact)); // Observing the Contact list from Contact
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }


  ngOnInit() {
        this.fetchCountry();
        this.store.dispatch(fetchContactsData({page: 1, itemsPerPage: 10, query: ''}));
        this.ContactList$.subscribe(data => {
        this.originalArray = data; // Contact the full Contact list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
           
        });
   }
    fetchCountry(){
          this.store.select(selectDataCountry).subscribe((data) =>{
            this.countrylist = [...data].map(country =>{
              const translatedName = country?.translation_data?.[0]?.name || 'No name available';
          
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
    onViewContacts(event: any){
      this.contactList = event;
      this.modalRef = this.modalService.show(this.showModal, this.config);
    }
    onFilterEvent(event: any){

      if(event.status && event.status !== 'all')
         this.filterTerm = event.status;
      else
        this.filterTerm = '';

      
      this.store.dispatch(fetchContactsData({page: 1, itemsPerPage: 10, query: this.searchTerm}));
   
    }
     onSearchEvent(event: any){
        this.searchTerm = event;
        this.store.dispatch(fetchContactsData({page: 1, itemsPerPage: 10, query: this.searchTerm}));
    
       }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    console.log(totalItems);
    
    this.store.dispatch(fetchContactsData({page: 1, itemsPerPage: totalItems, query: this.searchTerm}));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchContactsData({page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm}));
    
  }

  // Delete Contact
  onDelete(id: any) {
    console.log(id);
    this.store.dispatch(deleteContacts({userId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus };
    console.log(newData);
    
    //this.store.dispatch(updateContacts({ updatedData: newData }));
  }
  onClick(event: any) {
    if (event.type === 'crm-contact') {
      if (event.event === 'add') {
        this.openAddModal();
      } else if (event.event === 'edit') {
        this.openEditModal(event.data);
      }}
    }
    openAddModal() {
      this.modalRef = this.modalService.show(CreateCrmContactComponent, {
       
        class: 'modal-lg',  // Optional: Adjust modal size
        backdrop: 'static', // Optional: Prevent closing when clicking outside
        keyboard: false     // Optional: Prevent closing with ESC key
      });
    }
    openEditModal(data: any) {
      this.modalRef = this.modalService.show(EditCrmContactComponent, {
        initialState: {
          data: data // Pass the data to configure the form with existing data
        },
      });
    }

}
