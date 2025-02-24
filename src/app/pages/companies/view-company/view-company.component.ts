import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectedCompany } from 'src/app/store/companies/companies-selector';
import { getCompanyById } from 'src/app/store/companies/companies.action';
import { Company } from 'src/app/store/companies/companies.model';
import { selectDataCompany } from '../../../store/companies/companies-selector';
import { fetchQuotesData } from 'src/app/store/quotes/quotes.action';
import { fetchWinsData } from 'src/app/store/wins/wins.action';
import { selectDataWin } from 'src/app/store/wins/wins-selector';
import { selectDataQuote } from 'src/app/store/quotes/quotes-selector';
import { Quote } from 'src/app/store/quotes/quotes.model';
import { Win } from 'src/app/store/wins/wins.model';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrl: './view-company.component.scss'
})
export class ViewCompanyComponent implements OnInit {
/* eslint-disable @typescript-eslint/no-explicit-any */
@Input() type: string;
loading$: Observable<boolean>;
loadingQuotes$: Observable<boolean>;
loadingWins$: Observable<boolean>;
companies$: Observable<Company[]>;
quotes$: Observable<Quote[]>;
wins$: Observable<Win[]>;
quotes: Quote[] = [];
wins: Win[] = [];
Company : Company = null;
isEditing: boolean;
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

constructor(private readonly route: ActivatedRoute, private readonly store: Store, private readonly router: Router) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.loadingQuotes$ = this.store.pipe(select(selectDataLoading)); 
  this.loadingWins$ = this.store.pipe(select(selectDataLoading)); 
  this.companies$ = this.store.select(selectDataCompany);
  this.quotes$ = this.store.select(selectDataQuote);
  this.wins$ = this.store.select(selectDataWin);
  
}
toggleViewMode(){
  this.router.navigate(['/private/companies/list']);
}
ngOnInit() {
  this.fetchQuotes();
  this.fetchWins();
  const companyId = this.route.snapshot.params['id'];
  if(companyId){
    this.store.dispatch(getCompanyById({ CompanyId:  companyId}));
    this.store.pipe(select(selectedCompany), takeUntil(this.destroy$))
    .subscribe(company => {
      if(company){
        console.log(company);
        
        this.Company = company;
        this.isEditing = true;
      }
    });
    
  }
 
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

