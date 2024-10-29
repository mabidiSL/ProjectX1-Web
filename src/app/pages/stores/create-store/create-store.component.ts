import { Component } from '@angular/core';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrl: './create-store.component.css'
})
export class CreateStoreComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Stores' }, { label: 'Add store', active: true }];
  }
}
