import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-crm-contact',
  templateUrl: './view-crm-contact.component.html',
  styleUrl: './view-crm-contact.component.scss'
})
export class ViewCrmContactComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contact Details' }, { label: 'view contact', active: true }];
  }
}
