/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchPaymentlistData, fetchPaymentlistSuccess,
    fetchPaymentlistFail,
    addPaymentlistFailure,
    addPaymentlistSuccess,
    addPaymentlist,
    updatePaymentlistFailure,
    updatePaymentlistSuccess,
    updatePaymentlist,
    deletePaymentlistFailure,
    deletePaymentlistSuccess,
    deletePaymentlist,
    getPaymentById,
    getPaymentByIdSuccess,
    getPaymentByIdFailure
} from './payment.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentEffects {
 
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchPaymentlistData),
            mergeMap((/*{ page, itemsPerPage, status }*/) =>
              
                /*this.CrudService.fetchData('/payment',{ limit: itemsPerPage, page: page, status: status})*/
                this.http.get(`src\\assets\\data.json`) .pipe(
                    map((response: any) => fetchPaymentlistSuccess({ PaymentListdata : response.paymentMethods })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchPaymentlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );  
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addPaymentlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/payment', newData).pipe(
                    map((newData) => {
                     
                              this.toastr.success('The new Payment has been added successfully.');
                              this.router.navigate(['/private/payment/list']);
                          
                        // Dispatch the action to fetch the updated Payment list after adding a new Payment
                        return addPaymentlistSuccess({newData});
                      }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(addPaymentlistFailure({ error: errorMessage })); // Dispatch failure action
                    }))
                
            )
        )
    );
    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updatePaymentlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/payment/${updatedData.id}`, updatedData).pipe(
              map(() => {
              
                this.toastr.success('The Payment has been updated successfully.');
                this.router.navigate(['/private/payment/list']);
                return updatePaymentlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage);
                return of(updatePaymentlistFailure({ error: errorMessage }));
              }) 
            )
          )
        )
      );
      
   
   getPaymentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPaymentById),
      mergeMap(({ couponId }) => {
        // Use the selector to get the coupon from the store
        return this.CrudService.getDataById('/payment', couponId).pipe(
          map((coupon: any) => {
            if (coupon) {
              // Dispatch success action with the coupon data
              return getPaymentByIdSuccess({ coupon: coupon.result });
            } else {
             // this.toastr.error('Payment not found.'); // Show error notification
              return getPaymentByIdFailure({ error: 'Payment not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
            this.actions$.pipe(
            ofType(deletePaymentlist),
            mergeMap(({ couponId }) =>
                    this.CrudService.deleteData(`/payment/${couponId}`).pipe(
                        map(() => {
                            this.toastr.success('Payment deleted successfully.');
                            return deletePaymentlistSuccess({ couponId });
                          }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return  of(deletePaymentlistFailure({ error: errorMessage }))})
                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private http: HttpClient, 
        private formUtilService: FormUtilService,
        public toastr:ToastrService
    ) { }
   
  
}