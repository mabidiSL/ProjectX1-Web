import { Component } from '@angular/core';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view employee');
    this.breadCrumbItems = [{ label: 'Employee' }, { label: 'View Employee', active: true }];
  }
}
