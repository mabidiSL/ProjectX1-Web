/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCouponlistData, fetchCouponlistSuccess,
    fetchCouponlistFail,
    addCouponlistFailure,
    addCouponlistSuccess,
    addCouponlist,
    updateCouponlistFailure,
    updateCouponlistSuccess,
    updateCouponlist,
    deleteCouponlistFailure,
    deleteCouponlistSuccess,
    deleteCouponlist,
    getCouponById,
    getCouponByIdSuccess,
    getCouponByIdFailure
} from './coupon.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class CouponslistEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCouponlistData),
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/coupons',{ limit: itemsPerPage, page: page, status: status}).pipe(
                    map((response: any) => fetchCouponlistSuccess({ CouponListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchCouponlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );  
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCouponlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/coupons', newData).pipe(
                    map((newData) => {
                      const userRole = this.getCurrentUserRole(); 
                          if (userRole === 'Admin') {
                              this.toastr.success('The new Coupon has been added successfully.');
                              this.router.navigate(['/private/coupons']);
                          } else {
                              this.toastr.success('The new Coupon Request has been sent to Admin.');
                              this.router.navigate(['/private/coupons/approve']); 
                          }
                        // Dispatch the action to fetch the updated Coupon list after adding a new Coupon
                        return addCouponlistSuccess({newData});
                      }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(addCouponlistFailure({ error: errorMessage })); // Dispatch failure action
                    }))
                
            )
        )
    );
    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateCouponlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/coupons/${updatedData.id}`, updatedData).pipe(
              map(() => {
              
                this.toastr.success('The Coupon has been updated successfully.');
                this.router.navigate(['/private/coupons']);
                return updateCouponlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage);
                return of(updateCouponlistFailure({ error: errorMessage }));
              }) 
            )
          )
        )
      );
      
   
   getCouponById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCouponById),
      mergeMap(({ couponId }) => {
        // Use the selector to get the coupon from the store
        return this.CrudService.getDataById('/coupons', couponId).pipe(
          map((coupon: any) => {
            if (coupon) {
              // Dispatch success action with the coupon data
              return getCouponByIdSuccess({ coupon: coupon.result });
            } else {
             // this.toastr.error('Coupon not found.'); // Show error notification
              return getCouponByIdFailure({ error: 'Coupon not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
            this.actions$.pipe(
            ofType(deleteCouponlist),
            mergeMap(({ couponId }) =>
                    this.CrudService.deleteData(`/coupons/${couponId}`).pipe(
                        map(() => {
                            this.toastr.success('Coupon deleted successfully.');
                            return deleteCouponlistSuccess({ couponId });
                          }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return  of(deleteCouponlistFailure({ error: errorMessage }))})
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