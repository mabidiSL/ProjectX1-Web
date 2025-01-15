/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { selectDataLoading, selectOrderById } from 'src/app/store/Order/order-selector';
import { getOrderById } from 'src/app/store/Order/order.actions';
import { Order } from 'src/app/store/Order/order.models';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnDestroy {
[x: string]: any;

  modalRef?: BsModalRef;
  config:any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  selectedOrder : Order = null;
  loading$: Observable<any>;
  
  @Input() transactions: Array<any>;
  private readonly destroy$ = new Subject<void>();

  constructor(
     private readonly modalService: BsModalService,
     private readonly store: Store) { 
            this.loading$ = this.store.pipe(select(selectDataLoading));
      
     }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(data: any, content: TemplateRef<any>) {
    console.log('Open Modal for ', data);
    
    this.store.dispatch(getOrderById({OrderId: data.id }));
            // Subscribe to the selected order from the store
            this.store
            .pipe(
              select(selectOrderById),
              filter(order => !!order && order.id === data.id), // Ensure the order is loaded and matches the current ID
              take(1), // Take only the first emission
              takeUntil(this.destroy$)
            )
            .subscribe(order => {
                  if (order) {
                    console.log('retreived order',order);
                    console.log('i am in open modal for ', order.items);

                      order.items = order.items.reduce((acc, item) => {
                        console.log('start accumulator function');
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
                      }, []);
                      console.log('order after modification', order.items);
                      this.selectedOrder =  order; 
                      order = null;           
                    }
                  });
       
           this.modalRef = this.modalService.show(content, this.config);
           this.modalRef.onHidden?.subscribe(() => {
            this.selectedOrder = null;
          });
        
    
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
        }

}
