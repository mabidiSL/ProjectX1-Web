/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectDataLoading, selectDataRole, selectDataTotalItems } from 'src/app/store/Role/role-selector';
import { deleteRolelist, fetchRolelistData, updateRolelist } from 'src/app/store/Role/role.actions';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent  implements OnInit{
  
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  roleList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>
  searchTerm: string = '';
  searchPlaceholder: string ='Search By Role title'
  filterTerm: string = '';

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'}];

  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Title' },
    //{ property: 'createdAt', label: 'CreatedAt' },
    { property: 'status', label: 'Status' },
  ];

  constructor(private store: Store) {
      
      this.roleList$ = this.store.pipe(select(selectDataRole)); // Observing the Role list from Role
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

    }

  ngOnInit() {
          
        this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm }));
        this.roleList$.subscribe(data => {
        this.originalArray = data; // Role the full Role list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
       
        });
   }
  onFilterEvent(event: any){
       console.log(event);
       if(event.status !== 'all')
         this.filterTerm = event.status;
       else
         this.filterTerm = '';
   
       this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status: this.filterTerm }));
   
    }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: totalItems, query: this.searchTerm, status:this.filterTerm }));
   }

   onSearchEvent(event: any){
    console.log(event);
    this.searchTerm = event;
    this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm}));

   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm}));
    
  }

  // Delete Role
  onDelete(id: any) {
    this.store.dispatch(deleteRolelist({ RoleId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    event.data.status = newStatus;
    const newData = {id: event.data.id, status: event.data.status }
    this.store.dispatch(updateRolelist({ updatedData: newData }));
  }


}
