import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

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
    getLoggedMerchantById,
    getLoggedMerchantByIdFailure,
    getLoggedMerchantByIdSuccess
} from './merchantlist1.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectMerchantById } from './merchantlist1-selector';
import { CookieService } from 'ngx-cookie-service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class MerchantslistEffects1 {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchMerchantlistData),
            mergeMap(({ page, itemsPerPage, status }) => 
                  this.CrudService.fetchData('/merchants',this.setParams({ limit: itemsPerPage, page: page, status: status})).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => {return fetchMerchantlistSuccess({ MerchantListdata: response.result })}),
                    catchError((error) =>{
                        this.toastr.error('An error occurred while fetching the Merchant list. Please try again later.'); 
                        console.error('Fetch error:', error); 
                        return of(fetchMerchantlistFail({ error: 'Error fetching data' })); 
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
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(error.message);
                        return of(addMerchantlistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
    getLoggedMerchant$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getLoggedMerchantById),
        mergeMap(({ merchantId }) => {
          // get merchant by id
          return this.CrudService.getDataById('/merchants', merchantId).pipe(
            map(Merchant => {
              if (Merchant) {
                // Dispatch success action with the Merchant data
                return getLoggedMerchantByIdSuccess({ merchant: Merchant.result });
              } else {
                //this.toastr.error('Merchant not found.'); // Show error notification
                return getLoggedMerchantByIdFailure({ error: 'Merchant not found' });
              }
            })
          );
        })
      )
    );
    getMerchantById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getMerchantById),
          mergeMap(({ merchantId }) => {
            // Use the selector to get the Merchant from the store
            return this.store.select(selectMerchantById(merchantId)).pipe(
              map(Merchant => {
                if (Merchant) {
                  // Dispatch success action with the Merchant data
                  return getMerchantByIdSuccess({ merchant: Merchant });
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
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(updateMerchantlistFailure({ error }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteMerchantlist),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/merchants/${userId}`).pipe(
                        map((response: string) => {
                            this.toastr.success('Merchant deleted successfully.');
                            return deleteMerchantlistSuccess({ userId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the Merchant. Please try again.');
                            return  of(deleteMerchantlistFailure({ error: error.message }))})                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private cookieService: CookieService,
        private store: Store
    ) {

      this.currentLge = this.cookieService.get('lang');
     }
     currentLge: string = '';

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
      private setParams(payload: any): any{
        let params = new HttpParams();

        // Add language parameter if it's set
        if (this.currentLge && this.currentLge == 'ar') {
            params = params.set('lang', this.currentLge);
        }

        // Add any additional parameters from the payload
        if (payload) {
        for (const key in payload) {
            if (payload.hasOwnProperty(key)) {
            params = params.set(key, payload[key]);
            }
        }
        }
        console.log(params);
        return params;
      }
}