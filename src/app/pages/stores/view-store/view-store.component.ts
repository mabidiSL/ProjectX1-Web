import { Component } from '@angular/core';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrl: './view-store.component.css'
})
export class ViewStoreComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Stores' }, { label: 'View store', active: true }];
  }
}
