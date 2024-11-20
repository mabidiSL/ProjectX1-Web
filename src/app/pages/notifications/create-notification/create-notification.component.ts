import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrl: './create-notification.component.css'
})
export class CreateNotificationComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Notifications' }, { label: 'Add_notif', active: true }];
  }
}
