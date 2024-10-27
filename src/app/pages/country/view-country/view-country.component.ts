import { Component } from '@angular/core';

@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrl: './view-country.component.css'
})
export class ViewCountryComponent {
  breadCrumbItems: Array<{}>;
  ngOnInit() {
    console.log('i am in view country');
    this.breadCrumbItems = [{ label: 'countrys' }, { label: 'View country', active: true }];
  }
}
