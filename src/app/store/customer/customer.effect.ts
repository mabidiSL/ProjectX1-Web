/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {  fetchCustomerlistData, fetchCustomerlistFail, fetchCustomerlistSuccess,  } from './customer.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class CustomerEffects {
  

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCustomerlistData),
            mergeMap(({ page, itemsPerPage, role }) =>
                this.CrudService.fetchData('/users', { limit:itemsPerPage , page: page, role: role}).pipe(
                    map((response: any) => fetchCustomerlistSuccess({ CustomerListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchCustomerlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
  
    
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService
    ) { }
    
}