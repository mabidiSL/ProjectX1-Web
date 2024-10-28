import { Component } from '@angular/core';

@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrl: './view-notification.component.css'
})
export class ViewNotificationComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view notification');
    this.breadCrumbItems = [{ label: 'Notifications' }, { label: 'View Notification', active: true }];
  }
}
