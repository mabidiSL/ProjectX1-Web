import { Component } from '@angular/core';

@Component({
  selector: 'app-create-area',
  templateUrl: './create-area.component.html',
  styleUrl: './create-area.component.css'
})
export class CreateAreaComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Areas' }, { label: 'Add Area', active: true }];
  }
}
