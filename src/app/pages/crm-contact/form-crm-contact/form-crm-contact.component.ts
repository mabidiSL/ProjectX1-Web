/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { selectDataLoading } from 'src/app/store/contacts/contacts-selector';
import { fetchContactsData } from 'src/app/store/contacts/contacts.action';
import { Contact } from 'src/app/store/contacts/contacts.model';
import { selectDataContact } from '../../../store/contacts/contacts-selector';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-form-crm-contact',
  templateUrl: './form-crm-contact.component.html',
  styleUrl: './form-crm-contact.component.scss'
})
export class FormCrmContactComponent implements OnInit {
@Input() type: string;
loading$: Observable<boolean>;
contacts$: Observable<Contact[]>;
Contact : any = null;
isEditing: boolean;
private  readonly destroy$ = new Subject<void>();


constructor(
  private readonly route: ActivatedRoute,
  private readonly store: Store) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.store.dispatch(fetchContactsData())
  this.contacts$ = this.store.select(selectDataContact);
  
}
ngOnInit() {
  const contactId = this.route.snapshot.params['id'];
  if(contactId){
    this.contacts$.subscribe(contacts => {
      if(contacts){
        this.Contact = contacts.find(contact => contact.id === +contactId);
        console.log(this.Contact);
        
      }
    })
  }
  console.log(contactId);
  //  // Dispatch action to retrieve the contact by ID
  //       this.store.dispatch(getContactById({ ContactId:  contactId}));
  //       // Subscribe to the selected contact from the store
  //       this.store
  //         .pipe(select(selectedContact), takeUntil(this.destroy$))
  //         .subscribe(contact => {
  //           if (contact) {
  //             this.Contact = contact
  //             this.isEditing = true;
  
  //           }
  //         });
      

}
}