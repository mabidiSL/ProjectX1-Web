/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {  fetchCustomerlistData, fetchCustomerlistFail, fetchCustomerlistSuccess, getCustomerById, getCustomerByIdFailure, getCustomerByIdSuccess,  } from './customer.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class CustomerEffects {
  

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCustomerlistData),
            mergeMap(({ page, itemsPerPage,query, createdBy, role, status }) =>
                this.CrudService.fetchData('/users', { limit:itemsPerPage , page: page,query: query,createdBy: createdBy, role: role, status: status}).pipe(
                    map((response: any) => fetchCustomerlistSuccess({ CustomerListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                       
                      return of(fetchCustomerlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
    getCustomerById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getCustomerById),
          mergeMap(({ customerId }) => {
            // Use the selector to get the Customer from the store
            return this.CrudService.getDataById('/users', customerId).pipe(
              map((response: any) => {
                if (response) {
                  // Dispatch success action with the Customer data
                  return getCustomerByIdSuccess({ customer: response.result });
                } else {
                  //this.toastr.error('Customer not found.'); // Show error notification
                  return getCustomerByIdFailure({ error: 'Customer not found' });
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