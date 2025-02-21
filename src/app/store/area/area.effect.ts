/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchArealistData, fetchArealistSuccess,
    fetchArealistFail,
    addArealist,
    addArealistFailure,
    addArealistSuccess,
    deleteArealist,
    deleteArealistFailure,
    deleteArealistSuccess,
    getAreaById,
    getAreaByIdFailure,
    getAreaByIdSuccess,
    updateArealist,
    updateArealistFailure,
    updateArealistSuccess,
  
} from './area.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class AreaEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchArealistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/areas',{ limit: itemsPerPage, page: page}).pipe(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    map((response: any) => fetchArealistSuccess({ AreaListdata: response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
                      return of(fetchArealistFail({ error: errorMessage })); 
                      })
                )
            ),
        ),
    );
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addArealist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/areas', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new Area has been added successfully.');
                        this.router.navigate(['/private/areas/list']);
                        // Dispatch the action to fetch the updated Area list after adding a new Area
                        return addArealistSuccess({newData: response});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
                        return of(addArealistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
    getAreaById$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getAreaById),
        mergeMap(({ AreaId }) => {
          return this.CrudService.getDataById('/cities', AreaId).pipe(
            map((Area: any) => {
              if (Area ) {
                return getAreaByIdSuccess({ Area: Area.result});
              } else {
                return getAreaByIdFailure({ error: 'Area not found' });
              }
            })
          );
        })
      )
    );
    
    
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateArealist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/areas/${updatedData.id}`, updatedData).pipe(
                    map((response : any) =>
                    {
                        this.toastr.success('The Area has been updated successfully.');
                        this.router.navigate(['/private/areas/list']);
                        return updateArealistSuccess({ updatedData : response.result})
                    }),
                    catchError((error) =>{
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
                        return of(updateArealistFailure({ error:errorMessage  }));
                      }));
            }))
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteArealist),
            mergeMap(({ AreaId }) =>
                    this.CrudService.deleteData(`/areas/${AreaId}`).pipe(
                        map( ()=> {
                            // If response contains a success message or status, you might want to check it here
                            return deleteArealistSuccess({ AreaId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }     
                            return  of(deleteArealistFailure({ error: errorMessage }))})                )
            ))
    );
    
  
  
    
    
   
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService,
    ) { 
    }
  
}