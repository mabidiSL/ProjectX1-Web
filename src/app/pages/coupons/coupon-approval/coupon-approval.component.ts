

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { select, Store } from '@ngrx/store';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';


import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectApprovalData, selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/coupon/coupon-selector';
import { fetchCouponlistData, updateCouponlist } from 'src/app/store/coupon/coupon.action';


@Component({
  selector: 'app-coupon-approval',
  templateUrl: './coupon-approval.component.html',
  styleUrl: './coupon-approval.component.css'
})
export class CouponApprovalComponent implements OnInit {
// bread crumb items
breadCrumbItems: Array<{}>;
public Modules = Modules;
public Permission = Permission;

couponApprovalList$: Observable<any[]>;
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
  { property: 'createdAt', label: 'Request_Date' },
  { property: 'status', label: 'Status' },


];
  constructor(public toastr:ToastrService,  public store: Store) {
    this.store.dispatch(fetchCouponlistData({ page: 1, itemsPerPage: 10, status:'pending' }));
    this.loading$ = this.store.pipe(select(selectDataLoading));

      
  }

  ngOnInit() {
  
     
      setTimeout(() => {
        this.couponApprovalList$ = this.store.pipe(select(selectApprovalData));
        this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
        this.couponApprovalList$.subscribe(
          data => this.originalArray = data );
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
    onPageSizeChanged(event: any): void {
      const totalItems =  event.target.value;
      this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'pending' }));
     }
  
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending' }));
    
  }

  onApproveEvent( event: any) {
    const newData = { id: event.id , status: event.status};
    this.store.dispatch(updateCouponlist({ updatedData: newData }));
  }


 

}
 

 