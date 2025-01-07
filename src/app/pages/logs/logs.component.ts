/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { fetchLoglistData } from 'src/app/store/Log/log.actions';
import { selectDataLoading, selectDataLog, selectDataTotalItems } from 'src/app/store/Log/log-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';

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
  loading$: Observable<any>;
  currentId : number = null;
  searchTerm: string = '';
  filterDateTerm: string = null;

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];
  searchPlaceholder: string ='Search By Title'

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'translation_data[0].title', label: 'Title' },
    { property: 'translation_data[0].description', label: 'Description' },
    { property: 'ipAdress', label: 'IP Address' },
    { property: 'actionDate', label: 'Action_Date' },

  ];

  constructor(private store: Store, private authService: AuthenticationService) {
      
      this.logList$ = this.store.pipe(select(selectDataLog)); // Observing the Log list from Log
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

    }

  ngOnInit() {
        this.authService.currentUser$.subscribe((user)=>{this.currentId = user.id; console.log(this.currentId);});
        this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm , startDate: this.filterDateTerm}));
        this.logList$.subscribe(data => {
              this.originalArray = data; // Log the full Log list
              this.filteredArray = [...this.originalArray];
              console.log(this.filteredArray);
               document.getElementById('elmLoader')?.classList.add('d-none');    
       
        });
   }
    onFilterEvent(event: any){
         console.log(event);
         
         if(event.date )
           this.filterDateTerm = event.date.toLocaleDateString('en-CA');
          //event.date.toISOString().split('T')[0];
         else
           this.filterDateTerm = null;
               
         this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, startDate: this.filterDateTerm }));
     
        }
   onSearchEvent(event: any){
    console.log(event);
    this.searchTerm = event;
    this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: this.searchTerm, startDate: this.filterDateTerm }));

   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: totalItems,query: this.searchTerm, startDate: this.filterDateTerm }));
   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchLoglistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query: this.searchTerm, startDate: this.filterDateTerm }));
    
  }





}
