import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';


import {  select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { deleteCitylist, fetchCitylistData, updateCitylist } from 'src/app/store/City/city.action';
import { selectDataCity, selectDataLoading, selectDataTotalItems } from 'src/app/store/City/city-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';


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

  citiesList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'name', label: 'Name' },
    { property: 'area.name', label: 'Area' },
    { property: 'status', label: 'Status' },
  ];
  
  constructor(public store: Store) {
      
      this.citiesList$ = this.store.pipe(select(selectDataCity)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));


  }

  ngOnInit() {
   
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
    this.citiesList$.subscribe(data => {
      this.originalArray = data; // City the full City list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
      console.log('Finish get City list');
      console.log(this.filteredArray);

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: '' }));
    
  }

  onDelete(id: any) {
    this.store.dispatch(deleteCitylist({ CityId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    console.log('City ID:', event.data.id, 'New Status:', newStatus);
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateCitylist({ updatedData: newData }));
  }
  
  }
  



