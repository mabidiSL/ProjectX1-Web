/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { Country } from 'src/app/store/country/country.model';
import { selectDataLoading, selectDataMerchant, selectDataTotalItems } from 'src/app/store/merchantsList/merchantlist1-selector';
import { deleteMerchantlist, fetchMerchantlistData, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';

/**
 * Merchants list component
 */

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.css'
})
export class MerchantListComponent implements OnInit {


  breadCrumbItems: Array<{}>;
  
  public Modules = Modules;
  public Permission = Permission;


  MerchantList$: Observable<Merchant[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  
  searchTerm: string = '';
  filterTerm: string = '';
  searchPlaceholder: string ='Search By Merchant_Name or Email'

  isDropdownOpen : boolean = false;
  filteredArray: Merchant[] = [];
  originalArray: Merchant[] = [];
  countrylist: Country[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  checked : any = {status: 'active', label: 'Active'};
  unChecked : any = {status: 'inactive', label: 'inActive'};
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];

  columns : any[]= [
    { property: 'companyLogo', label: 'Merchant Logo' },
    { property: 'qrCode', label: 'Qr Merchant' },
    { property: 'activationCode', label: 'Activation Code' },
    { property: 'translation_data[0].name', label: 'Merchant_Name' },
    { property: 'user.country.translation_data[0].name', label: 'Country' },
    { property: 'user.status', label: 'Status' },
  ];

  constructor(public store: Store) {
    
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000, query:'', status: 'active' }));
      this.MerchantList$ = this.store.pipe(select(selectDataMerchant)); // Observing the Merchant list from Merchant
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
        this.fetchCountry();
        this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query: '', status: ''  }));
        this.MerchantList$.subscribe(data => {
        this.originalArray = data; // Merchant the full Merchant list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
       
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
   onSearchEvent(event: any){
    console.log(event);
    this.searchTerm = event;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status: '' }));

   }
   onFilterEvent(event: any){
    console.log(event);
    if(event.status !== 'all')
      this.filterTerm = event.status;
    else
      this.filterTerm = '';

    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status: this.filterTerm }));

   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: totalItems,query: this.searchTerm, status:this.filterTerm }));
   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage ,query: this.searchTerm, status: this.filterTerm}));
    
  }

  // Delete Merchant
  onDelete(id: any) {
    this.store.dispatch(deleteMerchantlist({userId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateMerchantlist({ updatedData: newData }));
  }
}