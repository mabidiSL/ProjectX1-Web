import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss'
})
export class EditCompanyComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Company Details' }, { label: 'update company', active: true }];
  }
}
