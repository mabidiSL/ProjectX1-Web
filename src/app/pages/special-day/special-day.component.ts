/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataSpecialDay, selectDataLoadingSpecial, selectDataTotalItems } from 'src/app/store/specialDay/special-selector';
import { deleteSpecialDaylist, fetchSpecialDaylistData, updateSpecialDaylist } from 'src/app/store/specialDay/special.action';
import { SpecialDay } from 'src/app/store/specialDay/special.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateSpecialDayComponent } from './create-special-day/create-special-day.component';
import { EditSpecialDayComponent } from './edit-special-day/edit-special-day.component';
import { ViewSpecialDayComponent } from './view-special-day/view-special-day.component';


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
 companyId: number =  null;

 filterstatusTerm: string = '';
 filterstartDateTerm: string = null;
 filterendDateTerm: string = null;


 isDropdownOpen : boolean = false;
 filteredArray: SpecialDay[] = [];
 originalArray: SpecialDay[] = [];
 modalRef: BsModalRef;

 itemPerPage: number = 10;
 currentPage : number = 1;

 columns : any[]= [
   { property: 'startDate', label: 'Date' },
   { property: 'dayName', label: 'Day Name' },
   { property: 'translation_data[0].name', label: 'Special Day Name' },
   { property: 'translation_data[0].description', label: 'Special Day Description' },
   { property: 'recursAnnually', label: 'Recurs Annually' }
  ];

 constructor(
   private readonly modalService: BsModalService,
   private readonly authservice: AuthenticationService,
   public toastr:ToastrService,
   public store: Store) {
    this.authservice.currentUser$.subscribe(user => {
      this.companyId =  user?.companyId;
      
    } );
     this.specialDayList$ = this.store.pipe(select(selectDataSpecialDay)); 
     this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
     this.loading$ = this.store.pipe(select(selectDataLoadingSpecial));

 }

 ngOnInit() {
  
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterstartDateTerm, company_id: this.companyId}));
   this.specialDayList$.subscribe(data => {
     this.originalArray = data; // SpecialDay the full SpecialDay list
     this.filteredArray = [...this.originalArray];
     document.getElementById('elmLoader')?.classList.add('d-none');
    

   });
      
 }
 onFilterEvent(event: any){
   
   if(event.date ){
     console.log(event.date);
     this.filterstartDateTerm = event.date.toLocaleDateString("en-CA");
     console.log(this.filterstartDateTerm);
   }
   else
     this.filterstartDateTerm = null;
   
   
    this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterstartDateTerm, company_id: this.companyId}));
   
 }
 onSearchEvent(event: any){
   this.searchTerm = event;
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterstartDateTerm , company_id: this.companyId}));

  }
 onPageSizeChanged(event: any): void {
   const totalItems =  event.target.value;
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: totalItems, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterstartDateTerm, company_id: this.companyId}));
  }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
   this.currentPage = event.page;
   this.store.dispatch(fetchSpecialDaylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query:this.searchTerm, startDate: this.filterstartDateTerm, endDate: this.filterstartDateTerm, company_id: this.companyId}));
   
 }

 // Delete specialDay
 onDelete(id: number) {
   this.store.dispatch(deleteSpecialDaylist({ SpecialDayId: id }));
 }

onClick(event: any) {
  if (event.type === 'special-day') {
    if (event.event === 'add') {
      this.openAddModal();
    } else if (event.event === 'edit') {
      this.openEditModal(event.data);
    }else if (event.event === 'view') {
      this.openViewModal(event.data);
    }}
  }
  openAddModal() {
    this.modalRef = this.modalService.show(CreateSpecialDayComponent, {
     
      //class: 'modal-sm',  // Optional: Adjust modal size
      backdrop: 'static', // Optional: Prevent closing when clicking outside
      keyboard: false     // Optional: Prevent closing with ESC key
    });
  }
  openEditModal(data: any) {
    this.modalRef = this.modalService.show(EditSpecialDayComponent, {
      initialState: {
        data: data // Pass the data to configure the form with existing data
      },
    });
  }
  openViewModal(data: any) {
    this.modalRef = this.modalService.show(ViewSpecialDayComponent, {
      initialState: {
        data: data // Pass the data to configure the form with existing data
  }});
}
 onChangeEvent( event: any) {
   const newStatus = event.event.checked ? 'active' : 'inactive'; 
   const newData = {id: event.data.id, status: newStatus }
   this.store.dispatch(updateSpecialDaylist({ updatedData: newData}));
 }

}

