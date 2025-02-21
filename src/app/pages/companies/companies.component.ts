/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectDataCompany, selectDataLoading, selectDataTotalItems } from 'src/app/store/companies/companies-selector';
import { deleteCompanies, fetchCompaniesData } from 'src/app/store/companies/companies.action';
import { Company } from 'src/app/store/companies/companies.model';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { Country } from 'src/app/store/country/country.model';

import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;
  contactList: any[] = [];
  CompanyList$: Observable<Company[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchPlaceholder: string ='Search By Company Name, Owner'
  filterTerm: string = '';
  searchTerm: string = '';
  countrylist: Country[] = [];
  modalRef?: BsModalRef | null = null;
  @ViewChild('ViewContent', { static: false }) showModal?: TemplateRef<any>;


  isDropdownOpen : boolean = false;
  filteredArray: Company[] = [];
  originalArray: Company[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];
  columns : any[]= [
    { property: 'translation_data[0]?.name', label: 'Company Name' },
    { property: 'address_county', label: 'Country' },
    { property: 'sector', label: 'Sector' },
    { property: 'crm_contacts', label: 'Contacts' },
    { property: 'user', label: 'Owner' },
  ];
  config:any = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  
  constructor(public store: Store, private readonly modalService: BsModalService) {
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
      this.CompanyList$ = this.store.pipe(select(selectDataCompany)); // Observing the Company list from Company
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }


  ngOnInit() {
        this.fetchCountry();
        this.store.dispatch(fetchCompaniesData({page: 1, itemsPerPage: 10, query: ''}));
        this.CompanyList$.subscribe(data => {
        this.originalArray = data; // Company the full Company list
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
  
      this.store.dispatch(fetchCompaniesData({page: 1, itemsPerPage: 10, query: this.searchTerm}));
   
  }
  onSearchEvent(event: any){
        this.searchTerm = event;
        this.store.dispatch(fetchCompaniesData({page: 1, itemsPerPage: 10, query: this.searchTerm}));
    
  }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    console.log(totalItems);
    
    this.store.dispatch(fetchCompaniesData({page: 1, itemsPerPage: totalItems, query: this.searchTerm}));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCompaniesData({page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm} ));
    
  }

  // Delete Company
  onDelete(id: any) {
    console.log(id);
    this.store.dispatch(deleteCompanies({userId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus };
    console.log(newData);
    
    //this.store.dispatch(updateCompanies({ updatedData: newData }));
  }


}
