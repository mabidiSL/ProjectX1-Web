import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-special-day',
 
  templateUrl: './create-special-day.component.html',
  styleUrl: './create-special-day.component.scss'
})
export class CreateSpecialDayComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Special Days' }, { label: 'Add Special Day', active: true }];
  }
}
