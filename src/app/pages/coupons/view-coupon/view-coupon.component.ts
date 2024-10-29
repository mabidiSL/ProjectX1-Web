import { Component } from '@angular/core';

@Component({
  selector: 'app-view-coupon',
  templateUrl: './view-coupon.component.html',
  styleUrl: './view-coupon.component.css'
})
export class ViewCouponComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Coupons' }, { label: 'View coupon', active: true }];
  }
}
