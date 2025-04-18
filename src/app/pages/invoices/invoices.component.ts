/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable, Subscription } from 'rxjs';
import { selectDataInvoice, selectDataLoading, selectDataTotalItems } from 'src/app/store/invoices/invoice-selector';
import { deleteInvoicelist, fetchInvoicelistData } from 'src/app/store/invoices/invoice.actions';

import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnInit, OnDestroy {


  
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  invoiceList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>
  searchTerm: string = '';
  searchPlaceholder: string ='Search By InvoiceID or Billing Name'
  filterTerm: string = '';
  filterDateTerm: string = null;
  category_invoice: string = null
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  private routeSubscription: Subscription;

  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'paid', label: 'Paid'},
    {status: 'unpaid', label: 'UnPaid'},
  ];
  columns : any[]= [
    { property: 'id', label: '#InvoiceID' },
    { property: 'billingName', label: 'Billing To' },
    { property: 'orderItems[0]?.status', label: 'Invoice Status' },
    { property: 'dueDate', label: 'Due Date' },
    { property: 'totalAmount', label: 'Total Amount' },

  ];

  constructor(private store: Store,private route: ActivatedRoute) {
      
      this.invoiceList$ = this.store.pipe(select(selectDataInvoice)); // Observing the Invoice list from Invoice
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.category_invoice = params.get('path');
      if (this.category_invoice) {
        this.fetchInvoices();
      }
    });
       
   }
   fetchInvoices(){
    this.store.dispatch(fetchInvoicelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category: this.category_invoice, dueDate: this.filterDateTerm, status:this.filterTerm }));
    this.invoiceList$.subscribe(data => {
    this.originalArray = data; // Invoice the full Invoice list
    this.filteredArray = [...this.originalArray];
    document.getElementById('elmLoader')?.classList.add('d-none');
   
    });
   }
  onFilterEvent(event: any){
       if(event.status !== 'all')
         this.filterTerm = event.status;
       else
         this.filterTerm = '';
       if(event.date )
          this.filterDateTerm = event.date.toLocaleDateString('en-CA');
        //event.date.toISOString().split('T')[0];
       else
          this.filterDateTerm = null;
   
       this.store.dispatch(fetchInvoicelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category: this.category_invoice, dueDate: this.filterDateTerm,  status: this.filterTerm }));
   
    }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchInvoicelistData({ page: this.currentPage, itemsPerPage: totalItems, query: this.searchTerm, category:this.category_invoice, dueDate: this.filterDateTerm, status:this.filterTerm }));
   }

   onSearchEvent(event: any){
    this.searchTerm = event;
    this.store.dispatch(fetchInvoicelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category: this.category_invoice, dueDate: this.filterDateTerm,status:this.filterTerm}));

   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchInvoicelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category:this.category_invoice, dueDate: this.filterDateTerm, status:this.filterTerm}));
    
  }

  // Delete Invoice
  onDelete(id: any) {
    this.store.dispatch(deleteInvoicelist({ InvoiceId: id }));
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }



}
