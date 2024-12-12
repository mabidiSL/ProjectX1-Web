/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { modalRegisterSuccess } from 'src/app/store/Authentication/authentication.actions';


@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrl: './modals.component.scss'
})
export class ModalsComponent {
  @Input() message: string;

  
  
  constructor(private modalRef: BsModalRef, private store: Store,private router: Router) {}

  closeModal(): void {
    this.modalRef.hide();
    this.store.dispatch(modalRegisterSuccess());
    this.router.navigate(['/auth/login']);

  }
}
