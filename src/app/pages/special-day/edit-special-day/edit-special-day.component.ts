import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-special-day',

  templateUrl: './edit-special-day.component.html',
  styleUrl: './edit-special-day.component.scss'
})
export class EditSpecialDayComponent implements OnInit {
  breadCrumbItems: Array<object>;
  @Input() data: number;
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Special Days' }, { label: 'Update Special Day', active: true }];
  }
}
