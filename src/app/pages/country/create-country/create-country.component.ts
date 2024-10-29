import { Component } from '@angular/core';

@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrl: './create-country.component.css'
})
export class CreateCountryComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Countries' }, { label: 'Add Country', active: true }];
  }
}
