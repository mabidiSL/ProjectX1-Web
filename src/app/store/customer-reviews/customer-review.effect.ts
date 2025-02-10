/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {  fetchCustomerReviewlistData, fetchCustomerReviewlistFail, fetchCustomerReviewlistSuccess, getCustomerReviewById, getCustomerReviewByIdFailure, getCustomerReviewByIdSuccess,  } from './customer-review.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class CustomerReviewEffects {
  

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCustomerReviewlistData),
            mergeMap(({ page, itemsPerPage,query, category }) =>
                this.CrudService.fetchData('/rates', { limit:itemsPerPage , page: page,query: query, category: category}).pipe(
                    map((response: any) => fetchCustomerReviewlistSuccess({ CustomerReviewListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

                      return of(fetchCustomerReviewlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
    getCustomerReviewById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getCustomerReviewById),
          mergeMap(({ customerId }) => {
            // Use the selector to get the CustomerReview from the store
            return this.CrudService.getDataById('/rates', customerId).pipe(
              map((response: any) => {
                if (response) {
                  // Dispatch success action with the CustomerReview data
                  return getCustomerReviewByIdSuccess({ customer: response.result });
                } else {
                  //this.toastr.error('CustomerReview not found.'); // Show error notification
                  return getCustomerReviewByIdFailure({ error: 'CustomerReview not found' });
                }
              })
            );
          })
        )
      );
  
    
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService
    ) { }
    
}