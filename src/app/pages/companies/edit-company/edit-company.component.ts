import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss'
})
export class EditCompanyComponent  {
  @Input() data: number;

}
