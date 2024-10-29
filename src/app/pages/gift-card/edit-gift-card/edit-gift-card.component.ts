import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-gift-card',
  templateUrl: './edit-gift-card.component.html',
  styleUrl: './edit-gift-card.component.css'
})
export class EditGiftCardComponent {
 // bread crumb items
 breadCrumbItems: Array<{}>;

 ngOnInit() {
   this.breadCrumbItems = [{ label: 'Gift-cards' }, { label: 'Edit Gift-Card', active: true }];
}
}
