import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/store/store-selector';
import { fetchStorelistData, updateStorelist } from 'src/app/store/store/store.action';



@Component({
  selector: 'app-approve-store',
  templateUrl: './approve-store.component.html',
  styleUrl: './approve-store.component.css'
})
export class ApproveStoreComponent {
// bread crumb items
breadCrumbItems: Array<{}>;
public Modules = Modules;
public Permission = Permission;

storeApprovalList$: Observable<any[]>;
totalItems$: Observable<number>;
loading$: Observable<any>

isDropdownOpen : boolean = false;
filteredArray: any[] = [];
originalArray: any[] = [];

itemPerPage: number = 10;
currentPage : number = 1;

columns : any[]= [
  { property: 'name', label: 'Title' },
  { property: 'merchant.merchantName', label: 'Merchant_Name' },
  { property: 'createdAt', label: 'Request_Date' },
  { property: 'status', label: 'Status' },
];
  constructor(public toastr:ToastrService,  public store: Store) {
    this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10, status: 'pending', merchant_id:'' }));
    this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
       
    setTimeout(() => {
       this.storeApprovalList$ = this.store.pipe(select(selectData));
       this.storeApprovalList$.subscribe(
          data => {
            this.originalArray = data;
          console.log(this.originalArray);
        });
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
     
    onPageSizeChanged(event: any): void {
      const totalItems =  event.target.value;
      this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: totalItems, status:'pending' }));
     }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending', merchant_id:'' }));
    
  }

  onApproveEvent( event: any) {
    console.log('Store ID:', event.id, 'New Status:', event.status);
    const newData = { id: event.id , status: event.status};
    this.store.dispatch(updateStorelist({ updatedData: newData }));
  }

}
