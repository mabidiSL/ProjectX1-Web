import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrl: './view-company.component.scss'
})
export class ViewCompanyComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Company Details' }, { label: 'view company', active: true }];
  }
}
