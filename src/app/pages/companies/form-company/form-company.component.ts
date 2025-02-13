import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { selectDataLoading } from 'src/app/store/companies/companies-selector';
import { fetchCompaniesData } from 'src/app/store/companies/companies.action';
import { Company } from 'src/app/store/companies/companies.model';
import { selectDataCompany } from '../../../store/companies/companies-selector';

@Component({
  selector: 'app-form-company',
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.scss'
})
export class FormCompanyComponent implements OnInit {
@Input() type: string;
loading$: Observable<boolean>;
companies$: Observable<Company[]>;
Company : Company = null;
isEditing: boolean;
private  readonly destroy$ = new Subject<void>();


constructor(private readonly route: ActivatedRoute, private readonly store: Store) {
  this.loading$ = this.store.pipe(select(selectDataLoading)); 
  this.store.dispatch(fetchCompaniesData())
  this.companies$ = this.store.select(selectDataCompany);
  
}
ngOnInit() {
  const companyId = this.route.snapshot.params['id'];
  if(companyId){
    this.companies$.subscribe(companies => {
      if(companies){
        
        this.Company = companies.find(company => company.id === +companyId);
        console.log(this.Company);
        
      }
    })
  }
  console.log(companyId);
  //  // Dispatch action to retrieve the company by ID
  //       this.store.dispatch(getCompanyById({ CompanyId:  companyId}));
  //       // Subscribe to the selected company from the store
  //       this.store
  //         .pipe(select(selectedCompany), takeUntil(this.destroy$))
  //         .subscribe(company => {
  //           if (company) {
  //             this.Company = company
  //             this.isEditing = true;
  
  //           }
  //         });
      

}
}
