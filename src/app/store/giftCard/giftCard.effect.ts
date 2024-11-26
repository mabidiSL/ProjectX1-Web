/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchGiftCardlistData, fetchGiftCardlistSuccess,
    fetchGiftCardlistFail,
    addGiftCardlistFailure,
    addGiftCardlistSuccess,
    addGiftCardlist,
    updateGiftCardlistFailure,
    updateGiftCardlistSuccess,
    updateGiftCardlist,
    deleteGiftCardlistFailure,
    deleteGiftCardlistSuccess,
    deleteGiftCardlist,
    getGiftCardById,
    getGiftCardByIdSuccess,
    getGiftCardByIdFailure
} from './giftCard.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class GiftCardsEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchGiftCardlistData),
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/gift-cards',{ limit: itemsPerPage, page: page, status: status}).pipe(
                    map((response: any) => fetchGiftCardlistSuccess({ GiftCardListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(fetchGiftCardlistFail({ error: errorMessage })); 
                    })
                    )
                ),
            ),
        
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addGiftCardlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/gift-cards', newData).pipe(
                    map((newData) => {
                      const userRole = this.getCurrentUserRole(); 
                        if (userRole === 'Admin') {
                            this.toastr.success('The new GiftCard has been added successfully.');
                            this.router.navigate(['/private/giftCards']);
                        } else {
                            this.toastr.success('The new GiftCard Request has been sent to Admin.');
                            this.router.navigate(['/private/giftCards/approve']); // Redirect to pending coupons for non-admins
                        }
                        
                        // Dispatch the action to fetch the updated GiftCard list after adding a new GiftCard
                        return addGiftCardlistSuccess({newData});
                      }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(addGiftCardlistFailure({ error: errorMessage }));})
                )
            )
        )
    );
   

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateGiftCardlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/gift-cards/${updatedData.id}`, updatedData).pipe(
              map(() => {
                
                this.toastr.success('The GiftCard has been updated successfully.');
                this.router.navigate(['/private/giftCards']);
                return updateGiftCardlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => {
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage); 
                return of(updateGiftCardlistFailure({ error: errorMessage }));}) // Catch errors and return the failure action
            )
          )
        )
      );
      
    
   getGiftCardById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGiftCardById),
      mergeMap(({ GiftCardId }) => {
        // Use the selector to get the GiftCard from the store
        return this.CrudService.getDataById('/gift-cards', GiftCardId).pipe(
          map(GiftCard => {
            if (GiftCard) {
              // Dispatch success action with the GiftCard data
              return getGiftCardByIdSuccess({ GiftCard });
            } else {
              //this.toastr.error('GiftCard not found.')
              return getGiftCardByIdFailure({ error: 'GiftCard not found' }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteGiftCardlist),
            mergeMap(({ GiftCardId }) =>
                    this.CrudService.deleteData(`/gift-cards/${GiftCardId}`).pipe(
                        map(() => {
                          this.toastr.success('GiftCard deleted successfully.');
                          return deleteGiftCardlistSuccess({ GiftCardId });
                          }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return  of(deleteGiftCardlistFailure({ error: errorMessage }))})
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
   
    private getCurrentUserRole(): string {
      // Replace with your actual logic to retrieve the user role
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser ? currentUser.role.translation_data[0].name : '';
    }
}