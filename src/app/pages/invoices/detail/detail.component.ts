import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectInvoiceById } from 'src/app/store/invoices/invoice-selector';
import { getInvoiceById } from 'src/app/store/invoices/invoice.actions';
import { Invoice } from 'src/app/store/invoices/invoice.models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

/**
 * Invoices Detail component
 */
export class DetailComponent implements OnInit, OnDestroy {

 // bread crumb items
 breadCrumbItems: Array<object>;
 Invoice: Invoice| null = null;
 loading$: Observable<boolean>;
 private destroy$ = new Subject<void>();
 parentRoute: string = '';

 constructor(private route: ActivatedRoute, private store: Store) { 
        this.loading$ = this.store.pipe(select(selectDataLoading)); 
  
 }

 ngOnInit() {
   //this.breadCrumbItems = [{ label: 'Invoices' }, { label: 'Detail', active: true }];
   this.parentRoute = this.route.snapshot.params['path'];
   const InvoiceId = this.route.snapshot.params['id'];
         if (InvoiceId) {
          
           // Dispatch action to retrieve the Country by ID
           this.store.dispatch(getInvoiceById({ InvoiceId }));
           
           // Subscribe to the selected Country from the Country
           this.store
             .pipe(select(selectInvoiceById), takeUntil(this.destroy$))
             .subscribe(invoice => {
               if (invoice) {
                 this.mapToNewOrderList(invoice);                 }
             });
         }
 }
 mapToNewOrderList(invoice: Invoice){

  invoice.orderItems = invoice.orderItems.reduce((acc, item) => {
    // Find if the item already exists in the accumulator array
    const existingItem = acc.find(i => i.offer_id === item.offer_id);
  
    if (existingItem) {
      // If item exists, increment the quantity
      existingItem.quantity += 1;
    } else {
      item.quantity = 1;
      // If item doesn't exist, add it to the array
      acc.push({ ...item });
    }
  
    return acc;
  }, [])

  this.Invoice =  invoice;
 }
 ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
}
