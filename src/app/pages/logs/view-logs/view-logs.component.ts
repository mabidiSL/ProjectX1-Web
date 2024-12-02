import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrl: './view-logs.component.scss'
})
export class ViewLogsComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Logs' }, { label: 'View_log', active: true }];
  }
}
