import { Component } from '@angular/core';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Role' }, { label: 'View Role', active: true }];
  }
}
