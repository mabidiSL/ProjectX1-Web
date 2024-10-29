import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrl: './edit-notification.component.css'
})
export class EditNotificationComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Notifications' }, { label: 'Edit Notification', active: true }];
  }
}
