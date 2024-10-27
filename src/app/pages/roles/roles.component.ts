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
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  roleList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'name', label: 'Title' },
    { property: 'createdAt', label: 'CreatedAt' },
    { property: 'status', label: 'Status' },
  ];

  constructor(private store: Store) {
      
      this.roleList$ = this.store.pipe(select(selectDataRole)); // Observing the Role list from Role
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

    }

  ngOnInit() {
          
        this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,status:'' }));
        this.roleList$.subscribe(data => {
        this.originalArray = data; // Role the full Role list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
        console.log('Finish get Role list');
        console.log(this.filteredArray);
        });
   }

   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    console.log(event.page);
    this.store.dispatch(fetchRolelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Role
  onDelete(id: any) {
    this.store.dispatch(deleteRolelist({ RoleId: id }));
  }

 
  onChangeEvent( event: any) {
    console.log(event);
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    console.log('Role ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    this.store.dispatch(updateRolelist({ updatedData: event.data }));
  }


}
