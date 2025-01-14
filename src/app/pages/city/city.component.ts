/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import {  select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { deleteCitylist, fetchCitylistData, updateCitylist } from 'src/app/store/City/city.action';
import { selectDataCity, selectDataLoadingCities, selectDataTotalItems } from 'src/app/store/City/city-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { City } from 'src/app/store/City/city.model';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent  implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  citiesList$: Observable<City[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  filterTerm: string = '';
  countryList:  any[] = null;
  filterCountryTerm: number = null;
  searchPlaceholder: string ='Search By Name'

  isDropdownOpen : boolean = false;
  filteredArray: City[] = [];
  originalArray: City[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];

  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Name' },
    { property: 'country.translation_data[0].name', label: 'Country' },
    { property: 'status', label: 'Status' },
  ];
  
  constructor(public store: Store) {
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000,query:'', status: 'active' }));
      
      this.citiesList$ = this.store.pipe(select(selectDataCity)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoadingCities));


  }

  ngOnInit() {
   this.fetchCountries();
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, country_id:this.filterCountryTerm, status:this.filterTerm }));
    this.citiesList$.subscribe(data => {
      this.originalArray = data; // City the full City list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
     

    });
       
  }
  fetchCountries(){
     this.store.select(selectDataCountry).subscribe((data) => { 
             this.countryList =  [...data].map(country =>{
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
  onFilterEvent(event: any){
    
          if(event.status && event.status !== 'all')
             this.filterTerm = event.status;
          else
            this.filterTerm = '';
          if(event.country)
          {
            console.log(event.country);
            this.filterCountryTerm = event.country;}
          else
              this.filterCountryTerm = null;
    
          this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, country_id:this.filterCountryTerm, status: this.filterTerm }));
       
        }
  onSearchEvent(event: any){
    this.searchTerm = event;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm,country_id:this.filterCountryTerm, status:this.filterTerm}));

   }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: totalItems, query: this.searchTerm, country_id:this.filterCountryTerm,status:this.filterTerm }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, country_id:this.filterCountryTerm,status: this.filterTerm }));
    
  }

  onDelete(id: number) {
    this.store.dispatch(deleteCitylist({ CityId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateCitylist({ updatedData: newData }));
  }
  
  }
  



