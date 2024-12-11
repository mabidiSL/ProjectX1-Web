/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrl: './modals.component.scss'
})
export class ModalsComponent {
  @Input() message: string;

  
  
  constructor(private modalRef: BsModalRef, private router: Router
  ) {}

  closeModal(): void {
    this.modalRef.hide();
    this.router.navigate(['/auth/login']);

  }
}
