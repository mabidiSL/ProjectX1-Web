/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectDataTotalItems, selectDataLoading } from 'src/app/store/notification/notification-selector';
import { selectDataOrder } from 'src/app/store/Order/order-selector';
import { fetchOrderlistData, deleteOrderlist, updateOrderlist } from 'src/app/store/Order/order.actions';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnInit {


  
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  orderList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>
  searchTerm: string = '';
  searchPlaceholder: string ='Search By InvoiceID or Billing Name'
  filterTerm: string = '';
  filterDateTerm: string = null;

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'paid', label: 'Paid'},
    {status: 'unpaid', label: 'Refund'},
    {status: 'refund', label: 'Refund'}];

  columns : any[]= [
    { property: 'order_id', label: '#InvoiceID' },
    { property: 'users.email', label: 'Billing To' },
    { property: 'status', label: 'Invoice Status' },
    { property: 'dueDate', label: 'Due Date' },
    { property: 'order_id', label: 'Total Amount' },

  ];

  constructor(private store: Store) {
      
      this.orderList$ = this.store.pipe(select(selectDataOrder)); // Observing the Order list from Order
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
          
        this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm }));
        this.orderList$.subscribe(data => {
        this.originalArray = data; // Order the full Order list
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
       if(event.date )
          this.filterDateTerm = event.date.toISOString().split('T')[0];
       else
          this.filterDateTerm = null;
   
       this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status: this.filterTerm }));
   
    }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: totalItems, query: this.searchTerm, status:this.filterTerm }));
   }

   onSearchEvent(event: any){
    console.log(event);
    this.searchTerm = event;
    this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm}));

   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, status:this.filterTerm}));
    
  }

  // Delete Order
  onDelete(id: any) {
    this.store.dispatch(deleteOrderlist({ OrderId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    event.data.status = newStatus;
    const newData = {id: event.data.id, status: event.data.status }
    this.store.dispatch(updateOrderlist({ updatedData: newData }));
  }


}
