/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchSpecialDaylistData, fetchSpecialDaylistSuccess,
    fetchSpecialDaylistFail,
    addSpecialDaylistFailure,
    addSpecialDaylistSuccess,
    addSpecialDaylist,
    updateSpecialDaylistFailure,
    updateSpecialDaylistSuccess,
    updateSpecialDaylist,
    deleteSpecialDaylistFailure,
    deleteSpecialDaylistSuccess,
    deleteSpecialDaylist,
    getSpecialDayById,
    getSpecialDayByIdSuccess,
    getSpecialDayByIdFailure
} from './special.action';
import { ToastrService } from 'ngx-toastr';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class SpecialDaysEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchSpecialDaylistData),
            mergeMap(({ page, itemsPerPage, query,  startDate, endDate, company_id }) =>
                this.CrudService.fetchData('/special-days',{ limit: itemsPerPage, page: page, query: query,  startDate: startDate, endDate: endDate, company_id: company_id}).pipe(
                    map((response: any) => fetchSpecialDaylistSuccess({ SpecialDayListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(fetchSpecialDaylistFail({ error: errorMessage })); 
                    })
                    )
                ),
            ),
        
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addSpecialDaylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/special-days', newData).pipe(
                    map((newData) => {
                      
                        this.toastr.success('The new SpecialDay has been added successfully.');
                        this.router.navigate(['/private/special-day/list']);
                        // Dispatch the action to fetch the updated SpecialDay list after adding a new SpecialDay
                        return addSpecialDaylistSuccess({newData});
                      }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(addSpecialDaylistFailure({ error: errorMessage }));})
                )
            )
        )
    );
   

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateSpecialDaylist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/special-days/${updatedData.id}`, updatedData).pipe(
              map(() => {
                
                this.toastr.success('The SpecialDay has been updated successfully.');
                this.router.navigate(['/private/special-day/list']);
                return updateSpecialDaylistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => {
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage); 
                return of(updateSpecialDaylistFailure({ error: errorMessage }));}) // Catch errors and return the failure action
            )
          )
        )
      );
      
    
   getSpecialDayById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSpecialDayById),
      mergeMap(({ SpecialDayId }) => {
        // Use the selector to get the SpecialDay from the store
        return this.CrudService.getDataById('/special-days', SpecialDayId).pipe(
          map((SpecialDay: any) => {
            if (SpecialDay) {
              // Dispatch success action with the SpecialDay data
              return getSpecialDayByIdSuccess({ SpecialDay: SpecialDay.result  });
            } else {
              //this.toastr.error('SpecialDay not found.')
              return getSpecialDayByIdFailure({ error: 'SpecialDay not found' }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteSpecialDaylist),
            mergeMap(({ SpecialDayId }) =>
                    this.CrudService.deleteData(`/special-days/${SpecialDayId}`).pipe(
                        map(() => {
                          this.toastr.success('SpecialDay deleted successfully.');
                          return deleteSpecialDaylistSuccess({ SpecialDayId });
                          }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return  of(deleteSpecialDaylistFailure({ error: errorMessage }))})
                )
            )
        )
    );
    
    
    constructor(
        private readonly actions$: Actions,
        private readonly CrudService: CrudService,
        private readonly router: Router,
        private readonly formUtilService: FormUtilService,
        private readonly authservice: AuthenticationService,
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