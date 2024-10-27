import { Component } from '@angular/core';

@Component({
  selector: 'app-view-city',
  templateUrl: './view-city.component.html',
  styleUrl: './view-city.component.css'
})
export class ViewCityComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view city');
    this.breadCrumbItems = [{ label: 'city' }, { label: 'View city', active: true }];
  }
}
