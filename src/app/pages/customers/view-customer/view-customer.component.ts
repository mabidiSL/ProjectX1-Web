import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.scss'
})
export class ViewCustomerComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Customers' }, { label: 'View_customer', active: true }];
  }
}

