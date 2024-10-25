import { Component } from '@angular/core';

@Component({
  selector: 'app-view-gift-card',
  templateUrl: './view-gift-card.component.html',
  styleUrl: './view-gift-card.component.css'
})
export class ViewGiftCardComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    console.log('i am in view gift cards');
    this.breadCrumbItems = [{ label: 'GiftCards' }, { label: 'View Gift Card', active: true }];
}
}
