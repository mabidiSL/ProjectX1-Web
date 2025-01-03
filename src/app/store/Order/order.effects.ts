/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchOrderlistData, fetchOrderlistSuccess,
    fetchOrderlistFail,
    addOrderlistFailure,
    addOrderlistSuccess,
    addOrderlist,
    updateOrderlistFailure,
    updateOrderlistSuccess,
    updateOrderlist,
    deleteOrderlistFailure,
    deleteOrderlistSuccess,
    deleteOrderlist,
    getOrderById,
    getOrderByIdSuccess,
    getOrderByIdFailure
} from './order.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class OrdersEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchOrderlistData),
            mergeMap(({ page, itemsPerPage, query,date, status }) =>
                this.CrudService.fetchData('/orders',{ limit: itemsPerPage, page: page,query: query, date: date,status: status}).pipe(
                    map((response: any) => fetchOrderlistSuccess({ OrderListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchOrderlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addOrderlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/roles', newData).pipe(
                    map((newData) => {
                        
                        this.toastr.success('The new Order has been added successfully.');
                        this.router.navigate(['/private/roles/list']);
                        // Dispatch the action to fetch the updated Order list after adding a new Order
                        return addOrderlistSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage);
                        return of(addOrderlistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
   updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateOrderlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/roles/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.toastr.success('The Order has been updated successfully.');
                this.router.navigate(['/private/roles/list']);
                return updateOrderlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage);
                return of(updateOrderlistFailure({ error: errorMessage }));
              })             )
          )
        )
      );
      

   getOrderById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrderById),
      mergeMap(({ OrderId }) => {
        // Use the selector to get the Order from the store
        return this.CrudService.getDataById('/orders', OrderId).pipe(
          map((Order: any) => {
            if (Order) {
              // Dispatch success action with the Order data
              return getOrderByIdSuccess({ Order: Order.result });
            } else {
              //this.toastr.error('Order not found.'); // Show error notification
              return getOrderByIdFailure({ error: 'Order not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteOrderlist),
            mergeMap(({ OrderId }) =>
                    this.CrudService.deleteData(`/orders/${OrderId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            this.toastr.success('The Order has been deleted successfully.');
                            return deleteOrderlistSuccess({ OrderId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);  
                            return  of(deleteOrderlistFailure({ error: errorMessage }))})      
                                    )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private formUtilService: FormUtilService,
        public toastr:ToastrService
    ) { }
    
}