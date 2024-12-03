import { Component,  Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})
export class PagetitleComponent {

  @Input() breadcrumbItems;
  @Input() title: string;

  constructor() { }

 
}
