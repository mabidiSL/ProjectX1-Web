import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/coupon/coupon-selector';
import { deleteCouponlist, fetchCouponlistData, updateCouponlist } from 'src/app/store/coupon/coupon.action';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent  implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  couponList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>


  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'name', label: 'Title' },
    { property: 'merchant.merchantName', label: 'Merchant_Name' },
    { property: 'startDateCoupon', label: 'Start_Date' },
    { property: 'endDateCoupon', label: 'End_Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(
    public toastr:ToastrService,
    public store: Store) {
      
      this.couponList$ = this.store.pipe(select(selectData)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
   
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
    this.couponList$.subscribe(data => {
      this.originalArray = data; // Coupon the full Coupon list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
      console.log('Finish get Coupon list');
      console.log(this.filteredArray);

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Store
  onDelete(id: any) {
    this.store.dispatch(deleteCouponlist({ couponId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.checked ? 'active' : 'expired'; 
    console.log('Coupon ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    this.store.dispatch(updateCouponlist({ updatedData: event.data }));
  }

 }

