/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchMerchantlistData, fetchMerchantlistSuccess,
    fetchMerchantlistFail,
    addMerchantlistFailure,
    addMerchantlistSuccess,
    addMerchantlist,
    updateMerchantlistFailure,
    updateMerchantlistSuccess,
    updateMerchantlist,
    deleteMerchantlistFailure,
    deleteMerchantlistSuccess,
    deleteMerchantlist,
    getMerchantById,
    getMerchantByIdSuccess,
    getMerchantByIdFailure,
   
} from './merchantlist1.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormUtilService } from 'src/app/core/services/form-util.service';


@Injectable()
export class MerchantslistEffects1 {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchMerchantlistData),
            mergeMap(({ page, itemsPerPage,query, status }) => 
                  this.CrudService.fetchData('/merchants',{ limit: itemsPerPage, page: page,query: query, status: status}).pipe(
                    map((response: any) => {return fetchMerchantlistSuccess({ MerchantListdata: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(fetchMerchantlistFail({ error: error.message })); 
                      })
                )
                ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addMerchantlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/merchants', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new merchant has been added successfully.');
                        this.router.navigate(['/private/merchants/list']);
                        // Dispatch the action to fetch the updated merchant list after adding a new merchant
                        return addMerchantlistSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage); 
                        return of(addMerchantlistFailure({ error: error.message })); // Dispatch failure action
                      }))
            )
        )
    );
    getLoggedMerchant$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getMerchantById),
        mergeMap(({ merchantId }) => {
          // get merchant by id
          return this.CrudService.getDataById('/merchants', merchantId).pipe(
            map((Merchant: any) => {
              if (Merchant ) {
                // Dispatch success action with the Merchant data
                return getMerchantByIdSuccess({ merchant: Merchant.result });
              } else {
                this.toastr.error('Merchant not found.'); // Show error notification
                return getMerchantByIdFailure({ error: 'Merchant not found' });
              }
            })
          );
        })
      )
    );
   
  
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateMerchantlist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/merchants/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    this.toastr.success('The merchant has been updated successfully.');
                    this.router.navigate(['/private/merchants/list']);
                    return  updateMerchantlistSuccess({ updatedData })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);  
                      return of(updateMerchantlistFailure({ error: error.message }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteMerchantlist),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/merchants/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Merchant deleted successfully.');
                            return deleteMerchantlistSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);                          
                            return  of(deleteMerchantlistFailure({ error: error.message }))})                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService,
        private store: Store
    ) {

     }

    private getErrorMessage(error: any): string {
        // Implement logic to convert backend error to user-friendly message
        if (error.status === 400) {
          return 'Invalid Merchant data. Please check your inputs and try again.';
        } else if (error.status === 409) {
          return 'A Merchant with this code already exists.';
        } else {
          return 'An unexpected error occurred. Please try again later.';
        }
      }
     
}