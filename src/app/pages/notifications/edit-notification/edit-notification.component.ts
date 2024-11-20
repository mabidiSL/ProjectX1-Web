import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrl: './edit-notification.component.css'
})
export class EditNotificationComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Notifications' }, { label: 'Edit_notification', active: true }];
  }
}
