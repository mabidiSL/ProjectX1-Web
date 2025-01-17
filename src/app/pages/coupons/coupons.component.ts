/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataOffer, selectDataLoading, selectDataTotalItems } from 'src/app/store/offer/offer-selector';
import { deleteOfferlist, fetchOfferlistData, updateOfferlist } from 'src/app/store/offer/offer.action';
import { Offer } from 'src/app/store/offer/offer.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent  implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  couponList$: Observable<Offer[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>
  searchTerm: string = '';

  filterstatusTerm: string = '';
  filterstartDateTerm: string = null;
  filterendDateTerm: string = null;


  isDropdownOpen : boolean = false;
  filteredArray: Offer[] = [];
  originalArray: Offer[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  statusList: any[] = [
    {status: 'all', label: 'All'},
    {status: 'active', label: 'Active'},
    {status: 'inactive', label: 'inActive'},
    {status: 'pending', label: 'Pending'}
  ];
  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Title' },
    { property: 'translation_data[0].description', label: 'Description' },
    { property: 'companies.translation_data[0].name', label: 'Merchant_Name' },
    { property: 'startDate', label: 'Start_Date' },
    { property: 'endDate', label: 'End_Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(
    public toastr:ToastrService,
    public store: Store) {
      
      this.couponList$ = this.store.pipe(select(selectDataOffer)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
   
    this.store.dispatch(fetchOfferlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, category:'coupon', query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm, status:this.filterstatusTerm }));
    this.couponList$.subscribe(data => {
      this.originalArray = data; // Offer the full Offer list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
     

    });
       
  }
  onFilterEvent(event: any){
    this.filterstatusTerm = '';
    if(event.status && event.status !== 'all')
      this.filterstatusTerm = event.status;
    if(event.startdate ){
      console.log(event.startdate);
      this.filterstartDateTerm = event.startdate.toLocaleDateString("en-CA");
      console.log(this.filterstartDateTerm);
    }
    else
      this.filterstartDateTerm = null;
    if(event.enddate )
        this.filterendDateTerm = event.enddate.toLocaleDateString("en-CA");
     else
        this.filterendDateTerm = null;
    
    this.store.dispatch(fetchOfferlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, category: 'coupon', query: this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm, status: this.filterstatusTerm }));
    
  }
  onSearchEvent(event: any){
    this.searchTerm = event;
    this.store.dispatch(fetchOfferlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, category: 'coupon',query: this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm, status:this.filterstatusTerm }));

   }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchOfferlistData({ page: this.currentPage, itemsPerPage: totalItems, category: 'coupon',query:  this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm, status:this.filterstatusTerm}));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchOfferlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, category: 'coupon',query:  this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm, status:this.filterstatusTerm}));
    
  }

  // Delete coupon
  onDelete(id: number) {
    this.store.dispatch(deleteOfferlist({ OfferId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateOfferlist({ updatedData: newData, offerType:'coupon' }));
  }

 }

