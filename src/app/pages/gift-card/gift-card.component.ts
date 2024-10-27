import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataGiftCard, selectDataLoading, selectDataTotalItems } from 'src/app/store/giftCard/giftCard-selector';
import { deleteGiftCardlist, fetchGiftCardlistData, updateGiftCardlist } from 'src/app/store/giftCard/giftCard.action';
import { Modules, Permission } from 'src/app/store/Role/role.models';



@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css'
})
export class GiftCardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  giftCardList$: Observable<any[]>;
  totalItems$: Observable<number>;
  loading$: Observable<any>

  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'name', label: 'Title' },
    { property: 'merchant.MerchantName', label: 'Merchant_Name' },
    { property: 'startDateGiftCard', label: 'Start_Date' },
    { property: 'endDateGiftCard', label: 'End_Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(
    public toastr:ToastrService,
    public store: Store) {
      
      this.giftCardList$ = this.store.pipe(select(selectDataGiftCard)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));


  }

  ngOnInit() {
   
    this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: '' }));
    this.giftCardList$.subscribe(data => {
      this.originalArray = data; // giftCard the full giftCard list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
      console.log('Finish get giftCard list');
      console.log(this.filteredArray);

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Store
  onDelete(id: any) {
    this.store.dispatch(deleteGiftCardlist({ GiftCardId: id }));
  }

 
  onChangeEvent( event: any) {
        const newStatus = event.event.checked ? 'active' : 'inactive'; 
    console.log('giftCard ID:', event.data.id, 'New Status:', newStatus);
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateGiftCardlist({ updatedData: newData }));
  }

 }

