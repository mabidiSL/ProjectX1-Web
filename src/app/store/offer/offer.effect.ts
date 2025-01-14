/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchOfferlistData, fetchOfferlistSuccess,
    fetchOfferlistFail,
    addOfferlistFailure,
    addOfferlistSuccess,
    addOfferlist,
    updateOfferlistFailure,
    updateOfferlistSuccess,
    updateOfferlist,
    deleteOfferlistFailure,
    deleteOfferlistSuccess,
    deleteOfferlist,
    getOfferById,
    getOfferByIdSuccess,
    getOfferByIdFailure
} from './offer.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Injectable()
export class OffersEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchOfferlistData),
            mergeMap(({ page, itemsPerPage, query, category, startDate, endDate,  status }) =>
                this.CrudService.fetchData('/offers',{ limit: itemsPerPage, page: page, query: query, category: category, startDate: startDate, endDate: endDate, status: status}).pipe(
                    map((response: any) => fetchOfferlistSuccess({ OfferListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(fetchOfferlistFail({ error: errorMessage })); 
                    })
                    )
                ),
            ),
        
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addOfferlist),
            mergeMap(({ newData, offerType }) =>
                this.CrudService.addData('/offers', newData).pipe(
                    map((newData) => {
                        if (this.userRole === 'Admin' || this.companyId === 1) {
                            this.toastr.success('The new Offer has been added successfully.');
                        } else {
                            this.toastr.success('The new Offer Request has been sent to Admin.');
                        }
                        if(offerType === 'coupon')
                          this.router.navigate(['/private/coupons/list']);
                        if(offerType === 'gift-card')
                          this.router.navigate(['/private/giftCards/list']);

                        // Dispatch the action to fetch the updated Offer list after adding a new Offer
                        return addOfferlistSuccess({newData});
                      }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(addOfferlistFailure({ error: errorMessage }));})
                )
            )
        )
    );
   

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateOfferlist),
          mergeMap(({ updatedData, offerType }) =>
            this.CrudService.updateData(`/offers/${updatedData.id}`, updatedData).pipe(
              map(() => {
                
                this.toastr.success('The Offer has been updated successfully.');
                if(offerType === 'coupon')
                  this.router.navigate(['/private/coupons/list']);
                if(offerType === 'gift-card')
                  this.router.navigate(['/private/giftCards/list']);
                return updateOfferlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => {
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage); 
                return of(updateOfferlistFailure({ error: errorMessage }));}) // Catch errors and return the failure action
            )
          )
        )
      );
      
    
   getOfferById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOfferById),
      mergeMap(({ OfferId }) => {
        // Use the selector to get the Offer from the store
        return this.CrudService.getDataById('/offers', OfferId).pipe(
          map((Offer: any) => {
            if (Offer) {
              // Dispatch success action with the Offer data
              return getOfferByIdSuccess({ Offer: Offer.result  });
            } else {
              //this.toastr.error('Offer not found.')
              return getOfferByIdFailure({ error: 'Offer not found' }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteOfferlist),
            mergeMap(({ OfferId }) =>
                    this.CrudService.deleteData(`/offers/${OfferId}`).pipe(
                        map(() => {
                          this.toastr.success('Offer deleted successfully.');
                          return deleteOfferlistSuccess({ OfferId });
                          }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return  of(deleteOfferlistFailure({ error: errorMessage }))})
                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private formUtilService: FormUtilService,
        private authservice: AuthenticationService,
        public toastr:ToastrService
    ) {
        this.authservice.currentUser$.subscribe(user => {
        this.userRole = user?.role.translation_data[0]?.name;
        this.companyId = user?.companyId;
        
      } );
   }
  userRole : string = null;
  companyId: number = null;
}