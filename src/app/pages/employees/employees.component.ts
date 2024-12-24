/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/employee/employee-selector';
import { deleteEmployeelist, fetchEmployeelistData, updateEmployeelist } from 'src/app/store/employee/employee.action';
import { Employee } from 'src/app/store/employee/employee.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  EmployeeList$: Observable<Employee[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  filterStatusTerm: string = '';
  filterRoleTerm: number = 4;
  searchPlaceholder: string ='Search By FName, LName or Email'

  isDropdownOpen : boolean = false;
  filteredArray: Employee[] = [];
  originalArray: Employee[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'},
  ];
  roleList: any[] = [];
  columns : any[]= [
    { property: 'translation_data[0].f_name', label: 'First_Name_tab' },
    { property: 'translation_data[0].l_name', label: 'Last_Name_tab' },
    { property: 'email', label: 'Email' },
    { property: 'role.translation_data[0].name', label: 'Role' },
    { property: 'status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.EmployeeList$ = this.store.pipe(select(selectData)); // Observing the Employee list from Employee
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
          
        this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query: this.searchTerm, role:4}));
        this.EmployeeList$.subscribe(data => {
        this.originalArray = data; // Employee the full Employee list
        data.forEach(
          empl => {
            if( empl.role){
              this.roleList.push({id:empl.role.id, name: empl.role.translation_data[0].name});
            }});
            this.roleList = this.roleList.filter((value, index, self) =>
              index === self.findIndex((t) => (
                t.id === value.id && t.name === value.name
              ))
            );
        console.log(this.roleList);
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
    
        });
   }

   onFilterEvent(event: any){
      console.log(event);
      this.filterStatusTerm = '';
      if(event.status && event.status !== 'all')
        this.filterStatusTerm = event.status;
      if(event.role )
        this.filterRoleTerm = event.role;
          
      this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm,role: this.filterRoleTerm, status: this.filterStatusTerm }));
     
      }
   onSearchEvent(event: any){
    console.log(event);
    this.searchTerm = event;
    this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, role: this.filterRoleTerm, status: this.filterStatusTerm}));

   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: totalItems,query: this.searchTerm , role: this.filterRoleTerm, status: this.filterStatusTerm}));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query: this.searchTerm , role: this.filterRoleTerm, status: this.filterStatusTerm}));
    
  }

  // Delete Employee
  onDelete(id: any) {
    this.store.dispatch(deleteEmployeelist({employeeId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateEmployeelist({ updatedData: newData }));
  }

}

