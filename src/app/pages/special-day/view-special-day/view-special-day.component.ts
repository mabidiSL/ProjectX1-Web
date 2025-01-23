import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-special-day',
 
  templateUrl: './view-special-day.component.html',
  styleUrl: './view-special-day.component.scss'
})
export class ViewSpecialDayComponent implements OnInit {
  breadCrumbItems: Array<object>;
  @Input() data: number;
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Special Days' }, { label: 'View Special Day', active: true }];
  }
}
