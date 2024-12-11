/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchStorelistData, fetchStorelistSuccess,
    fetchStorelistFail,
    addStorelistFailure,
    addStorelistSuccess,
    addStorelist,
    updateStorelistFailure,
    updateStorelistSuccess,
    updateStorelist,
    deleteStorelistFailure,
    deleteStorelistSuccess,
    deleteStorelist,
    getStoreById,
    getStoreByIdSuccess,
    getStoreByIdFailure
} from './store.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class StoreslistEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStorelistData),
            mergeMap(({ page, itemsPerPage,status, merchant_id }) =>
                this.CrudService.fetchData('/stores',{ limit: itemsPerPage, page: page,status: status, merchant_id: merchant_id}).pipe(
                    map((response: any) => {
                    return fetchStorelistSuccess({ StoreListdata: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchStorelistFail({ error: errorMessage })); 
                      })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addStorelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/stores', newData).pipe(
                    map((response: any) => {
                      
                      this.toastr.success('The new Store has been added successfully.');
                      this.router.navigate(['/private/stores']);
                        
                        // Dispatch the action to fetch the updated Store list after adding a new Store
                        return addStorelistSuccess({newData: response.result});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage);
                        return of(addStorelistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
    getStoreById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getStoreById),
          mergeMap(({ StoreId }) => {
            // Use the selector to get the Store from the store
            return this.CrudService.getDataById('/stores', StoreId).pipe(
              map((Store: any) => {
                if (Store) {
                  // Dispatch success action with the Store data
                  return getStoreByIdSuccess({ Store: Store.result });
                } else {
                  this.toastr.error('Store not found.'); // Show error notification
                  return getStoreByIdFailure({ error: 'Store not found' });
                }
              })
            );
          })
        )
      );
  
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateStorelist),
            mergeMap(({ updatedData }) => 
            this.CrudService.updateData(`/stores/${updatedData.id}`, updatedData).pipe(
                map((response: any) =>{
                this.toastr.success('The Store has been updated successfully.');
                this.router.navigate(['/private/stores']);
                return  updateStorelistSuccess({ updatedData: response.result })}),
                catchError((error) =>{
                  const errorMessage = this.formUtilService.getErrorMessage(error);
                  this.toastr.error(errorMessage);
                    return of(updateStorelistFailure({ error: errorMessage}));
             }) 
            )
        )
    )
);


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteStorelist),
            mergeMap(({ storeId }) =>
                    this.CrudService.deleteData(`/stores/${storeId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            this.toastr.success('The Store has been deleted successfully.');
                            return deleteStorelistSuccess({ storeId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);
                            return  of(deleteStorelistFailure({ error: errorMessage }))
                        })
                      ) 
                     )
            )
        );
    
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService
    ) { 
    }
}