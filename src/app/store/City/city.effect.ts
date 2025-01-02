/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCitylistData, fetchCitylistSuccess,
    fetchCitylistFail,
    addCitylist,
    addCitylistFailure,
    addCitylistSuccess,
    deleteCitylist,
    deleteCitylistFailure,
    deleteCitylistSuccess,
    getCityById,
    getCityByIdFailure,
    getCityByIdSuccess,
    updateCitylist,
    updateCitylistFailure,
    updateCitylistSuccess,
    getCityByCountryId,
    getCityByCountryIdFailure,
    getCityByCountryIdSuccess,
   
} from './city.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class CityEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCitylistData),
            mergeMap(({ page, itemsPerPage , query, status }) =>
                this.CrudService.fetchData('/cities',{ limit: itemsPerPage, page: page,query: query, status: status}).pipe(
                    map((response: any) => fetchCitylistSuccess({ CityListdata: response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage); 
                        return of(fetchCitylistFail({ error: errorMessage })); 
                      })
                )
            ),
        ),
    );
    getData$ = createEffect(() =>
      this.actions$.pipe(
          ofType(getCityByCountryId),
          mergeMap(({page, itemsPerPage, country_id }) =>
              this.CrudService.fetchData(`/cities/country/${country_id}`,{page: page, limit: itemsPerPage }).pipe(
                  map((response: any) => getCityByCountryIdSuccess({ CityListdata: response.result })),
                  catchError((error) =>{
                    const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(getCityByCountryIdFailure({ error: errorMessage })); 
                    })
              )
          ),
      ),
  );
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCitylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/cities', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new City has been added successfully.');
                        this.router.navigate(['/private/cities/list']);
                        // Dispatch the action to fetch the updated City list after adding a new City
                        return addCitylistSuccess({newData: response});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage); 
                        return of(addCitylistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
    getCityById$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getCityById),
        mergeMap(({ CityId }) => {
          return this.CrudService.getDataById('/cities', CityId).pipe(
            map((City: any) => {
              if (City ) {
                return getCityByIdSuccess({ City: City.result});
              } else {
                return getCityByIdFailure({ error: 'City not found' });
              }
            })
          );
        })
      )
    );
   
  

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCitylist),
            mergeMap(({ updatedData }) => {
               
                return this.CrudService.updateData(`/cities/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => 
                    {
                        this.toastr.success('The City has been updated successfully.');
                        this.router.navigate(['/private/cities/list']); 
                        return updateCitylistSuccess({ updatedData : response.result})
                    }),
                    catchError((error) =>{
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage); 
                        return of(updateCitylistFailure({ error: errorMessage }));
                      })                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCitylist),
            mergeMap(({ CityId }) =>
                    this.CrudService.deleteData(`/cities/${CityId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            return deleteCitylistSuccess({ CityId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage); 
                            return  of(deleteCitylistFailure({ error: errorMessage }))})                )
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