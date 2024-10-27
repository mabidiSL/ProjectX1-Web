import { Component } from '@angular/core';

@Component({
  selector: 'app-view-area',
  templateUrl: './view-area.component.html',
  styleUrl: './view-area.component.css'
})
export class ViewAreaComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view area');
    this.breadCrumbItems = [{ label: 'areas' }, { label: 'View area', active: true }];
  }
}
