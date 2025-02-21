 /* eslint-disable @typescript-eslint/no-explicit-any */
 import { Component, Input, OnInit } from '@angular/core';
 import { selectDataLoading, selectedContact } from 'src/app/store/contacts/contacts-selector';
 import { getContactById } from 'src/app/store/contacts/contacts.action';
 import { Contact } from 'src/app/store/contacts/contacts.model';
 import { selectDataContact } from '../../../store/contacts/contacts-selector';
 import { ActivatedRoute } from '@angular/router';
 import { Store, select } from '@ngrx/store';
 import { Observable, Subject, takeUntil } from 'rxjs';
 import { selectDataQuote } from 'src/app/store/quotes/quotes-selector';
 import { selectDataWin } from 'src/app/store/wins/wins-selector';
 import { Quote } from 'src/app/store/quotes/quotes.model';
 import { Win } from 'src/app/store/wins/wins.model';
 import { fetchQuotesData } from 'src/app/store/quotes/quotes.action';
 import { fetchWinsData } from 'src/app/store/wins/wins.action';
@Component({
  selector: 'app-view-crm-contact',
  templateUrl: './view-crm-contact.component.html',
  styleUrl: './view-crm-contact.component.scss'
})
export class ViewCrmContactComponent implements OnInit {
breadCrumbItems: Array<object>;
@Input() type: string;
loading$: Observable<boolean>;
loadingQuotes$: Observable<boolean>;
loadingWins$: Observable<boolean>;
contacts$: Observable<Contact[]>;
quotes$: Observable<Quote[]>;
wins$: Observable<Win[]>;
Contact : any = null;
isEditing: boolean;
quotes: Quote[] = [];
wins: Win[] = [];
userAddress: string = '';
private  readonly destroy$ = new Subject<void>();
socialActivities: any[] = [
        {
          "platform": "Twitter",
          "name": "Launch of New Feature",
          "description": "Announcing the launch of a new feature.. ",
          "date": "2025-02-10"
        },
        {
          "platform": "Facebook",
          "name": "Community Meetup Event",
          "description": "Join us for a virtual community meetup to discuss ...",
          "date": "2025-02-12"
        }
      ];
      activities: any[] = [
        {
          "lavatr": "D",
          "name": "Develop Software",
          "owner": "John Doe",
          "status": "In Progress",
          "level_of_priority": "High",
          "privacy": "Public",
          "date": "2025-02-01"
        },
        {
          "lavatr": "C",
          "name": "Code Review",
          "owner": "David Brown",
          "status": "Completed",
          "level_of_priority": "Medium",
          "privacy": "Private",
          "date": "2025-01-20"
        }
      ];

constructor(
  private readonly route: ActivatedRoute,
  private readonly store: Store) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.contacts$ = this.store.select(selectDataContact);
  this.loadingQuotes$ = this.store.pipe(select(selectDataLoading)); 
  this.loadingWins$ = this.store.pipe(select(selectDataLoading)); 
  this.quotes$ = this.store.select(selectDataQuote);
  this.wins$ = this.store.select(selectDataWin);
  
}
ngOnInit() {
  this.breadCrumbItems = [{ label: 'Contact Details' }, { label: 'view contact', active: true }];
  this.fetchQuotes();
  this.fetchWins();
  const contactId = this.route.snapshot.params['id'];
  if(contactId){
    this.store.dispatch(getContactById({ ContactId:  contactId}));
    this.store.pipe(select(selectedContact), takeUntil(this.destroy$))
    .subscribe(contact => {
      if(contact){
        console.log(contact);
        this.userAddress = contact.address_building + ' ' + contact.address_street + ' ' + contact.address_town + ' ' + contact.address_county + ' ' + contact.address_city + ' ' + contact.address_postcode;
        if(this.userAddress.trim() === '' || this.userAddress.includes('null')){
          this.userAddress = 'No Address';
        }
        this.Contact = contact;
        this.isEditing = true;
      }
    });
    
  }
  console.log(contactId);
     

}
fetchQuotes(){
  this.store.dispatch(fetchQuotesData({page: 1, itemsPerPage: 10, query: ''}));
  this.quotes$.subscribe(quotes => {
    this.quotes = quotes;
  });
}
fetchWins(){
  this.store.dispatch(fetchWinsData({page: 1, itemsPerPage: 10, query: ''}));
  this.wins$.subscribe(wins => {
    this.wins = wins;
  });
}   
}

