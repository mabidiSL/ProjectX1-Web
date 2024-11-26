/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCountrylistData, fetchCountrylistSuccess,
    fetchCountrylistFail,
    addCountrylist,
    addCountrylistFailure,
    addCountrylistSuccess,
    deleteCountrylist,
    deleteCountrylistFailure,
    deleteCountrylistSuccess,
    getCountryById,
    getCountryByIdFailure,
    getCountryByIdSuccess,
    updateCountrylist,
    updateCountrylistFailure,
    updateCountrylistSuccess,
  
} from './country.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class countrieslistEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCountrylistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/countries',{ limit: itemsPerPage, page: page}).pipe(
                    map((response: any) => fetchCountrylistSuccess({ CountryListdata: response.result })),
                    catchError((error) =>{
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage); 
                      return of(fetchCountrylistFail({ error: errorMessage }))
                    })
                )
            ),
        ),
    );
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCountrylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/countries', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new Country has been added successfully.');
                        this.router.navigate(['/private/countries']);
                        // Dispatch the action to fetch the updated Country list after adding a new Country
                        return addCountrylistSuccess({newData: response});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage); 
                        return of(addCountrylistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
    getCountryById$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getCountryById),
        mergeMap(({ CountryId }) => {
          return this.CrudService.getDataById('/countries', CountryId).pipe(
            map((Country: any) => {
              if (Country ) {
                return getCountryByIdSuccess({ Country: Country.result});
              } else {
                return getCountryByIdFailure({ error: 'Country not found' });
              }
            })
          );
        })
      )
    );
   
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCountrylist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/countries/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => {
                        this.toastr.success('The Country has been updated successfully.');
                        this.router.navigate(['/private/countries']);
                        return updateCountrylistSuccess({ updatedData : response.result})}),
                        catchError((error) =>{
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage); 
                            return of(updateCountrylistFailure({ error: errorMessage }));
                          })                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCountrylist),
            mergeMap(({ CountryId }) =>
                    this.CrudService.deleteData(`/countries/${CountryId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            return deleteCountrylistSuccess({ CountryId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage); 
                            return  of(deleteCountrylistFailure({ error: errorMessage }))})                )
            )
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