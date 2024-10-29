import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit{
  // bread crumb items
  breadCrumbItems: Array<{}>;
  
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Employees' }, { label: 'Edit employee', active: true }];
  }
}
