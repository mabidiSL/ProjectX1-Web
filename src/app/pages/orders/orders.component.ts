/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { selectDataLoading, selectDataOrder, selectDataTotalItems, selectOrderById } from 'src/app/store/Order/order-selector';
import { fetchOrderlistData, deleteOrderlist, updateOrderlist, getOrderById } from 'src/app/store/Order/order.actions';
import { Order } from 'src/app/store/Order/order.models';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {


    private destroy$ = new Subject<void>();
  
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  orderList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>;
  modalRef?: BsModalRef | null = null;
  subTotal: number = null;
  searchTerm: string = '';
  searchPlaceholder: string ='Search By OrderID or Billing Name(fName, lName)'
  filterTerm: string = '';
  filterDateTerm: string = null;

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];
  Order: Order = null;
  config:any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  itemPerPage: number = 10;
  currentPage : number = 1;
  @ViewChild('ViewContent', { static: false }) showModal?: TemplateRef<any>;

  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'paid', label: 'Paid'},
    {status: 'unpaid', label: 'UnPaid'},
    ];

  columns : any[]= [
    { property: 'id', label: '#OrderID' },
    { property: 'billingName', label: 'Billing Name' },
    { property: 'createdAt', label: 'Date' },
    { property: 'totalAmount', label: 'Total' },
    { property: 'status', label: 'Payment Status' },
    { property: 'payment_method', label: 'Payment Method' },

  ];

  constructor(private store: Store, private modalService: BsModalService  ) {
      
      this.orderList$ = this.store.pipe(select(selectDataOrder)); // Observing the Order list from Order
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));


    }

  ngOnInit() {
          
        this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, date: this.filterDateTerm,status:this.filterTerm }));
        this.orderList$.subscribe(data => {
        this.originalArray = data; // Order the full Order list
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
          //this.filterDateTerm = event.date.toISOString().split('T')[0];
       this.filterDateTerm = event.date.toLocaleDateString('en-CA'); // Outputs in YYYY-MM-DD format

       else
          this.filterDateTerm = null;
   
       this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, date: this.filterDateTerm,  status: this.filterTerm }));
   
    }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: totalItems, query: this.searchTerm, date: this.filterDateTerm,status:this.filterTerm }));
   }

   onSearchEvent(event: any){
    this.searchTerm = event;
    this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, date: this.filterDateTerm,status:this.filterTerm}));

   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchOrderlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm,date: this.filterDateTerm, status:this.filterTerm}));
    
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

  onViewDetail(event: any){
    this.store.dispatch(getOrderById({OrderId: event }));
        // Subscribe to the selected order from the store
        this.store
            .pipe(
              select(selectOrderById),
              filter(order => !!order && order.id === event), // Ensure the order is loaded and matches the current ID
              take(1), // Take only the first emission
              takeUntil(this.destroy$)
            )
            .subscribe(order => {
              if (order) {

                order.items = order.items.reduce((acc, item) => {
                  // Find if the item already exists in the accumulator array
                  const existingItem = acc.find(i => i.offer_id === item.offer_id);
                
                  if (existingItem) {
                    // If item exists, increment the quantity
                    existingItem.quantity += 1;
                  } else {
                    item.quantity = 1;
                    // If item doesn't exist, add it to the array
                    acc.push({ ...item });
                  }
                
                  return acc;
                }, [])
              
                this.Order =  order;
                order = null;
               
     
              }
            });
            this.modalRef = this.modalService.show(this.showModal, this.config);
            this.modalRef.onHidden?.subscribe(() => {
              this.Order = null;
            });

        }
       
calculateSubtotal(): void {
          this.subTotal = this.Order.items.reduce((acc: number, item: any) => {
            return acc + item.offers.price;
          }, 0);
 }
ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
        }
  }

