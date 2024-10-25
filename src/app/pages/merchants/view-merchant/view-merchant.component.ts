import { Component } from '@angular/core';

@Component({
  selector: 'app-view-merchant',
  templateUrl: './view-merchant.component.html',
  styleUrl: './view-merchant.component.css'
})
export class ViewMerchantComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view merchant');
    this.breadCrumbItems = [{ label: 'Merchants' }, { label: 'View Merchant', active: true }];
}
}
