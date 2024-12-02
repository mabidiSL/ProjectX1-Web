/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { fetchLoglistData } from 'src/app/store/Log/log.actions';
import { selectDataLoading, selectDataLog, selectDataTotalItems } from 'src/app/store/Log/log-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit {

 
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  logList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'translation_data[0].title', label: 'Title' },
    { property: 'translation_data[0].description', label: 'Description' },
    { property: 'ipAdress', label: 'IpAddress' },
    { property: 'actionDate', label: 'Action_Date' },

  ];

  constructor(private store: Store) {
      
      this.logList$ = this.store.pipe(select(selectDataLog)); // Observing the Log list from Log
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

    }

  ngOnInit() {
          
        this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,status:'' }));
        this.logList$.subscribe(data => {
        this.originalArray = data; // Log the full Log list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
       
        });
   }

   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: totalItems }));
   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }





}
