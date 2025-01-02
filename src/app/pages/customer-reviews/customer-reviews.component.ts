/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/customer-reviews/customer-review-selector';
import { fetchCustomerReviewlistData } from 'src/app/store/customer-reviews/customer-review.action';
import { CustomerReview } from 'src/app/store/customer-reviews/customer-review.model';

import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-customer-reviews',
  templateUrl: './customer-reviews.component.html',
  styleUrl: './customer-reviews.component.scss'
})
export class CustomerReviewsComponent implements OnInit {



  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  CustomerReviewList$: Observable<CustomerReview[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  searchPlaceholder: string ='Search By Email'
  filterTerm: string = '';
  searchTerm: string = '';


  isDropdownOpen : boolean = false;
  filteredArray: CustomerReview[] = [];
  originalArray: CustomerReview[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  categoryList: any[] = [
    {category: 'all', label: 'All'},
    {category: 'offer', label: 'Offer'},
    {category: 'company', label: 'Company'},
    {category: 'store', label: 'Store'}
  ];
  
  columns : any[]= [
    { property: 'billingName', label: 'Full Name' },
    //{ property: 'user.translation_data[0].l_name', label: 'Last_Name_tab' },
    { property: 'user.email', label: 'Email' },
    { property: 'category', label: 'Category' },
    { property: 'categoryInfo', label: 'Category Info' },
    { property: 'user.city.translation_data[0].name', label: 'City' },
    { property: 'rating', label: 'Rating' },
  ];

  constructor(public store: Store) {
      
      this.CustomerReviewList$ = this.store.pipe(select(selectData)); // Observing the CustomerReview list from CustomerReview
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
          
        this.store.dispatch(fetchCustomerReviewlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category: this.filterTerm}));
        this.CustomerReviewList$.subscribe(data => {
        this.originalArray = data; // CustomerReview the full CustomerReview list
        this.filteredArray = [...this.originalArray];
        console.log(this.filteredArray);
        
        document.getElementById('elmLoader')?.classList.add('d-none');
           
        });
   }
 onFilterEvent(event: any){
      console.log(event);

      if(event.category && event.category !== 'all')
         this.filterTerm = event.status;
      else
        this.filterTerm = '';
      
      this.store.dispatch(fetchCustomerReviewlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category: this.filterTerm}));
   
    }
   onSearchEvent(event: any){
        console.log(event);
        this.searchTerm = event;
        this.store.dispatch(fetchCustomerReviewlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, category: this.filterTerm}));
    
    }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCustomerReviewlistData({ page: this.currentPage, itemsPerPage: totalItems,  query: this.searchTerm, category: this.filterTerm }));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCustomerReviewlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query: this.searchTerm, category: this.filterTerm }));
    
  }

  // Delete CustomerReview
  onDelete(id: any) {
    console.log(id);
    
    //this.store.dispatch(deleteCustomerReviewlist({employeeId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus };
    console.log(newData);
    
    //this.store.dispatch(updateCustomerReviewlist({ updatedData: newData }));
  }

}

