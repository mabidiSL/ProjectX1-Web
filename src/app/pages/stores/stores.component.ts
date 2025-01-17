/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select , Store} from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { deleteStorelist, fetchStorelistData, updateStorelist } from 'src/app/store/store/store.action';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/store/store-selector';
import { Branch } from 'src/app/store/store/store.model';
import {  getCityByCountryId } from 'src/app/store/City/city.action';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { City } from 'src/app/store/City/city.model';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { AuthenticationService } from 'src/app/core/services/auth.service';

/**
 * Stores component
 */

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css'
})
export class StoresComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;
  currentRole: string = '';
  companyId: number;

  country_id: number = null;
  storeList$: Observable<Branch[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  searchPlaceholder: string ='Search By Branch Name'
  filterTerm: string = '';
  filterCityTerm: number = null;
  filterMerchantTerm: number = null;



  isDropdownOpen : boolean = false;
  filteredArray: Branch[] = [];
  originalArray: Branch[] = [];
  citylist:  City[] = [];
  merchantList:  Merchant[] = null;


  itemPerPage: number = 10;
  currentPage : number = 1;
  
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];

  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Store_Name' },
    { property: 'company.translation_data[0].name', label: 'Merchant' },
    { property: 'city.translation_data[0].name', label: 'City' },
    { property: 'status', label: 'Status' },
  ];

  constructor(public store: Store,    private authservice: AuthenticationService,
  ) {
    this.authservice.currentUser$.subscribe(user => {
      this.currentRole = user?.role.translation_data[0].name;
      this.country_id = user?.country_id;
      
    } );

     // this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 1000,query:'', status: 'active' }));
     this.store.dispatch(getCityByCountryId({page: 1, itemsPerPage: 1000,country_id: this.country_id }));
     this.store.dispatch(fetchMerchantlistData({page: 1, itemsPerPage: 1000,query:'', status: 'active' }));
      this.storeList$ = this.store.pipe(select(selectData)); // Observing the Store list from store
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));
     
    }

  ngOnInit() {
        if(this.currentRole === 'Admin' || this.companyId === 1){
          this.fetchMerchants();
        }
        this.fetchCities(); 
        this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query:this.searchTerm, status:this.filterTerm, company_id: this.filterMerchantTerm}));
        this.storeList$.subscribe(data => {
        this.originalArray = data; // Store the full Store list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
   
        });
   }
   fetchMerchants(){
       this.store.select(selectDataMerchant).subscribe((data) => { 
         this.merchantList =  [...data].map(merchant =>{
           const translatedName =  merchant.translation_data?.[0]?.name || 'No name available';
       
           return {
             ...merchant,  
             translatedName 
           };
         }).sort((a, b) => {
           // Sort by translatedName
           return a.translatedName.localeCompare(b.translatedName);
         });
       });
     }
    fetchCities(){
       this.store.select(selectDataCity).subscribe((data) => {
         this.citylist = [...data].map(city =>{
          const translatedName = city.translation_data?.[0]?.name || 'No name available';
      
          return {
            ...city,  
            translatedName 
          };
        })
        .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
        });
      });
    }
   onFilterEvent(event: any){

      if(event.status && event.status !== 'all')
         this.filterTerm = event.status;
      else
        this.filterTerm = '';

      if(event.city)
        this.filterCityTerm = event.city;
      else
        this.filterCityTerm = null;
      
      if(event.company)
          this.filterMerchantTerm = event.company;
      else
          this.filterMerchantTerm = null;

      this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status: this.filterTerm, city_id: this.filterCityTerm , company_id: this.filterMerchantTerm }));
   
    }
   onSearchEvent(event: any){
    this.searchTerm = event;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm, city_id: this.filterCityTerm ,company_id:this.filterMerchantTerm }));

   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: totalItems, query:this.searchTerm, status:this.filterTerm, city_id: this.filterCityTerm , company_id:this.filterMerchantTerm}));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, status:this.filterTerm, city_id: this.filterCityTerm ,company_id:this.filterMerchantTerm}));
    
  }

  // Delete Store
  onDelete(id: number) {
    this.store.dispatch(deleteStorelist({ storeId: id }));
  }

  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const updatedData = {id:event.data.id, status: newStatus}
    this.store.dispatch(updateStorelist({ updatedData: updatedData }));
  }


}
