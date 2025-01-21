/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataSpecialDay, selectDataLoading, selectDataTotalItems } from 'src/app/store/specialDay/special-selector';
import { deleteSpecialDaylist, fetchSpecialDaylistData, updateSpecialDaylist } from 'src/app/store/specialDay/special.action';
import { SpecialDay } from 'src/app/store/specialDay/special.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';


@Component({
  selector: 'app-special-day',
  templateUrl: './special-day.component.html',
  styleUrl: './special-day.component.scss'
})
export class SpecialDayComponent implements OnInit{
 // bread crumb items
 breadCrumbItems: Array<object>;
 public Modules = Modules;
 public Permission = Permission;

 specialDayList$: Observable<SpecialDay[]>;
 totalItems$: Observable<number>;
 loading$: Observable<boolean>
 searchTerm: string = '';

 filterstatusTerm: string = '';
 filterstartDateTerm: string = null;
 filterendDateTerm: string = null;


 isDropdownOpen : boolean = false;
 filteredArray: SpecialDay[] = [];
 originalArray: SpecialDay[] = [];

 itemPerPage: number = 10;
 currentPage : number = 1;

 columns : any[]= [
   { property: 'translation_data[0].name', label: 'Title' },
   { property: 'translation_data[0].description', label: 'Description' },
   { property: 'startDate', label: 'Start_Date' },
   { property: 'endDate', label: 'End_Date' },
   { property: 'recursAnnually', label: 'Recurs Annually' }
  ];

 constructor(
   public toastr:ToastrService,
   public store: Store) {
     
     this.specialDayList$ = this.store.pipe(select(selectDataSpecialDay)); 
     this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
     this.loading$ = this.store.pipe(select(selectDataLoading));

 }

 ngOnInit() {
  
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm}));
   this.specialDayList$.subscribe(data => {
     this.originalArray = data; // SpecialDay the full SpecialDay list
     this.filteredArray = [...this.originalArray];
     document.getElementById('elmLoader')?.classList.add('d-none');
    

   });
      
 }
 onFilterEvent(event: any){
   this.filterstatusTerm = '';
   if(event.status && event.status !== 'all')
     this.filterstatusTerm = event.status;
   if(event.startdate ){
     console.log(event.startdate);
     this.filterstartDateTerm = event.startdate.toLocaleDateString("en-CA");
     console.log(this.filterstartDateTerm);
   }
   else
     this.filterstartDateTerm = null;
   if(event.enddate )
       this.filterendDateTerm = event.enddate.toLocaleDateString("en-CA");
    else
       this.filterendDateTerm = null;
   
    this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm}));
   
 }
 onSearchEvent(event: any){
   this.searchTerm = event;
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm}));

  }
 onPageSizeChanged(event: any): void {
   const totalItems =  event.target.value;
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: totalItems, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm}));
  }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
   this.currentPage = event.page;
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterendDateTerm}));
   
 }

 // Delete specialDay
 onDelete(id: number) {
   this.store.dispatch(deleteSpecialDaylist({ SpecialDayId: id }));
 }


 onChangeEvent( event: any) {
   const newStatus = event.event.checked ? 'active' : 'inactive'; 
   const newData = {id: event.data.id, status: newStatus }
   this.store.dispatch(updateSpecialDaylist({ updatedData: newData}));
 }

}

