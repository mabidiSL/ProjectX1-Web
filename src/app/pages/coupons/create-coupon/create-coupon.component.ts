import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.css'
})
export class CreateCouponComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Coupons' }, { label: 'Add Coupon', active: true }];
  }
}
