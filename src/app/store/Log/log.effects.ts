/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchLoglistData, fetchLoglistSuccess,
    fetchLoglistFail,
    getLogById,
    getLogByIdSuccess,
    getLogByIdFailure
} from './log.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class LogsEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchLoglistData),
            mergeMap(({ page, itemsPerPage,query, startDate }) =>
                this.CrudService.fetchData('/actions',{ limit: itemsPerPage, page: page,query: query, startDate: startDate}).pipe(
                    map((response: any) => fetchLoglistSuccess({ LogListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
   
                      return of(fetchLoglistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
  
   
      

   getLogById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLogById),
      mergeMap(({ LogId }) => {
        // Use the selector to get the Log from the store
        return this.CrudService.getDataById('/actions', LogId).pipe(
          map((Log: any) => {
            if (Log) {
              // Dispatch success action with the Log data
              return getLogByIdSuccess({ Log: Log.result });
            } else {
              //this.toastr.error('Log not found.'); // Show error notification
              return getLogByIdFailure({ error: 'Log not found' });
            }
          })
        );
      })
    )
  );
 
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private formUtilService: FormUtilService,
        public toastr:ToastrService
    ) { }
    
}