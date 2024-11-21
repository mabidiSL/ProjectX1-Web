/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCitylistData, fetchCitylistSuccess,
    fetchCitylistFail,
   
} from './city.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class CityEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCitylistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/cities',{ limit: itemsPerPage, page: page}).pipe(
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
  
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService
    ) { 
    }
   
}