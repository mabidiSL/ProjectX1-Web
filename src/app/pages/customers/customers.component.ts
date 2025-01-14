
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/customer/customer-selector';
import { fetchCustomerlistData } from 'src/app/store/customer/customer.action';
import { Customer } from 'src/app/store/customer/customer.model';

import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  CustomerList$: Observable<Customer[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchPlaceholder: string ='Search By FName, LName or Email'
  filterTerm: string = '';
  searchTerm: string = '';


  isDropdownOpen : boolean = false;
  filteredArray: Customer[] = [];
  originalArray: Customer[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];
  columns : any[]= [
    { property: 'translation_data[0].f_name', label: 'First_Name_tab' },
    { property: 'translation_data[0].l_name', label: 'Last_Name_tab' },
    { property: 'email', label: 'Email' },
    { property: 'createdAt', label: 'Registration Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.CustomerList$ = this.store.pipe(select(selectData)); // Observing the Customer list from Customer
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
          
        this.store.dispatch(fetchCustomerlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, role:3 , query: this.searchTerm, status: this.filterTerm}));
        this.CustomerList$.subscribe(data => {
        this.originalArray = data; // Customer the full Customer list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
           
        });
   }
 onFilterEvent(event: any){

      if(event.status && event.status !== 'all')
         this.filterTerm = event.status;
      else
        this.filterTerm = '';

      
      this.store.dispatch(fetchCustomerlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,  role:3, query: this.searchTerm, status: this.filterTerm}));
   
    }
     onSearchEvent(event: any){
        this.searchTerm = event;
        this.store.dispatch(fetchCustomerlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, role:3, query: this.searchTerm, status: this.filterTerm}));
    
       }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCustomerlistData({ page: this.currentPage, itemsPerPage: totalItems, role:3, query: this.searchTerm, status: this.filterTerm }));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCustomerlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, role:3,query: this.searchTerm, status: this.filterTerm }));
    
  }

  // Delete Customer
  onDelete(id: any) {
    console.log(id);
    
    //this.store.dispatch(deleteCustomerlist({employeeId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus };
    console.log(newData);
    
    //this.store.dispatch(updateCustomerlist({ updatedData: newData }));
  }

}

