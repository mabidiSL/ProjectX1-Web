import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-crm-contact',

  templateUrl: './edit-crm-contact.component.html',
  styleUrl: './edit-crm-contact.component.scss'
})
export class EditCrmContactComponent {
  @Input() data: number;
}
