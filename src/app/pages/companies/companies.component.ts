/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectDataCompany, selectDataLoading, selectDataTotalItems } from 'src/app/store/companies/companies-selector';
import { fetchCompaniesData } from 'src/app/store/companies/companies.action';
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

  CompanyList$: Observable<Company[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchPlaceholder: string ='Search By Company Name, Owner'
  filterTerm: string = '';
  searchTerm: string = '';
  countrylist: Country[] = [];


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
    { property: 'name', label: 'Company Name' },
    { property: 'country', label: 'Country' },
    { property: 'sectors', label: 'Sections' },
    { property: 'contact_nbr', label: 'Contacts' },
    { property: 'owner', label: 'Owner' },
  ];

  constructor(public store: Store) {
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
      this.CompanyList$ = this.store.pipe(select(selectDataCompany)); // Observing the Company list from Company
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }


  ngOnInit() {
        this.fetchCountry();
        this.store.dispatch(fetchCompaniesData());
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
   
 onFilterEvent(event: any){

      if(event.status && event.status !== 'all')
         this.filterTerm = event.status;
      else
        this.filterTerm = '';

      
      this.store.dispatch(fetchCompaniesData());
   
    }
     onSearchEvent(event: any){
        this.searchTerm = event;
        this.store.dispatch(fetchCompaniesData( ));
    
       }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    console.log(totalItems);
    
    this.store.dispatch(fetchCompaniesData( ));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCompaniesData());
    
  }

  // Delete Company
  onDelete(id: any) {
    console.log(id);
    
    //this.store.dispatch(deleteCompanies({employeeId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus };
    console.log(newData);
    
    //this.store.dispatch(updateCompanies({ updatedData: newData }));
  }


}
