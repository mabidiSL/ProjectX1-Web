/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectOrderById } from 'src/app/store/Order/order-selector';
import { getOrderById } from 'src/app/store/Order/order.actions';


@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrl: './form-order.component.scss'
})
export class FormOrderComponent   implements OnInit, OnDestroy{
  
  @Input() type: string;
  modalRef?: BsModalRef;
  @ViewChild('ViewContent', { static: false }) showModal?: TemplateRef<any>;
 

  isEditing: boolean = false;
  private destroy$ = new Subject<void>();
  loading$: Observable<boolean>;
 


  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,    
    private store: Store){
      
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

    }
  
    
  ngOnInit() {
    setTimeout(() => {
      this.modalRef = this.modalService.show(this.showModal);
    });
    const orderId = this.route.snapshot.params['id'];
    if (orderId) {
      
      // Dispatch action to retrieve the order by ID
      this.store.dispatch(getOrderById({OrderId: orderId }));
      
      // Subscribe to the selected order from the store
      this.store
        .pipe(select(selectOrderById), takeUntil(this.destroy$))
        .subscribe(order => {
          if (order) {
            console.log(order);

 
          }
        });
    }
       
  }
  
  
  
 
 

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    this.router.navigateByUrl('/private/orders/list');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/orders/list');
}

}
