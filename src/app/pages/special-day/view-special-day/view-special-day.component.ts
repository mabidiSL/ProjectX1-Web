import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-special-day',
 
  templateUrl: './view-special-day.component.html',
  styleUrl: './view-special-day.component.scss'
})
export class ViewSpecialDayComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Special Days' }, { label: 'Update Special Day', active: true }];
  }
}
